import React, { useState, useEffect } from 'react';

// Font styles for splash animation
const fontStyles = [
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'sans-serif',
  'system-ui',
];

export default function App() {
  const [step, setStep] = useState('splash');
  const [linesExpanded, setLinesExpanded] = useState(false);
  const [userName, setUserName] = useState('');
  const [uniName, setUniName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentFonts, setCurrentFonts] = useState(
    Array('UNIASSIST'.length).fill('sans-serif')
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    "What's something you've learned...",
    'If you could teleport anywhere...',
    "What's one goal you want to achieve...",
  ]);

  // Load Google Fonts: "Italianno", "Cinzel", and "Satisfy"
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Italianno&family=Satisfy&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // STAGE 1: Splash Screen Animation
  useEffect(() => {
    if (step === 'splash') {
      const lineTimer = setTimeout(() => {
        setLinesExpanded(true);
      }, 300);

      let intervalCount = 0;
      const fontInterval = setInterval(() => {
        setCurrentFonts(
          'UNIASSIST'
            .split('')
            .map(
              () => fontStyles[Math.floor(Math.random() * fontStyles.length)]
            )
        );
        intervalCount++;
        if (intervalCount >= 18) {
          clearInterval(fontInterval);
          setCurrentFonts(Array('UNIASSIST'.length).fill('sans-serif'));
          setTimeout(() => setStep('login'), 600);
        }
      }, 120);

      return () => {
        clearTimeout(lineTimer);
        clearInterval(fontInterval);
      };
    }
  }, [step]);

  // STAGE 2: Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (!userName.trim() || !uniName.trim()) {
      setErrorMsg('Please fill in all details.');
      return;
    }
    if (uniName.trim().toLowerCase().includes('amity')) {
      setErrorMsg('');
      setStep('dashboard');
    } else {
      setErrorMsg('Access Denied: Dataset is only valid for Amity University.');
    }
  };

  // STAGE 3: Chat Message Handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    // Save to sidebar search history
    setHistory((prev) => [userText, ...prev]);
    setInput('');

    fetch('https://uniassist-backend-lh6z.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userText, question: userText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.bot_response || data.response || data.answer || 'No response received.',
          },
        ]);
      })
      .catch((err) => {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'Error connecting to backend server.',
          },
        ]);
      });
  };

  return (
    <div style={styles.appWrapper}>
      {/* 1. SPLASH SCREEN */}
      {step === 'splash' && (
        <div style={styles.pistaContainer}>
          <div style={styles.splashContentContainer}>
            <div
              style={{
                ...styles.horizontalLine,
                width: linesExpanded ? '280px' : '0px',
              }}
            />

            <h1 style={styles.splashTitle}>
              {'UNIASSIST'.split('').map((char, index) => (
                <span
                  key={index}
                  style={{
                    fontFamily: currentFonts[index],
                    display: 'inline-block',
                    margin: '0 4px',
                    color: '#3B2314',
                    fontSize: '3.2rem',
                    fontWeight: '700',
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            <div
              style={{
                ...styles.horizontalLine,
                width: linesExpanded ? '280px' : '0px',
              }}
            />
          </div>
        </div>
      )}

      {/* 2. SPLIT LOGIN SCREEN */}
      {step === 'login' && (
        <div style={styles.outerScreenContainer}>
          <div style={styles.floatingSplitCard}>
            {/* LEFT SIDE: Dark Brown Section */}
            <div style={styles.leftBrownSection}>
              <div style={styles.topBrandHeader}>
                <span style={styles.brandTitleText}>UNI ASSIST</span>
              </div>

              <div style={styles.centerBrandContainer}>
                <h1 style={styles.amityCenterTitle}>AMITY UNIVERSITY</h1>
                <div style={styles.centerDividerLine} />
              </div>

              <div style={styles.bottomQuoteContainer}>
                <p style={styles.italiannoQuote}>
                  "We are building a nation through education"
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: Light Creamy Pista Card */}
            <div style={styles.rightCreamCard}>
              <div style={styles.headerSection}>
                <h2 style={styles.welcomeTitle}>Welcome Back</h2>
                <p style={styles.subtextHeading}>
                  Sign in to continue your conversation with Amity Chatbot
                </p>
              </div>

              <form onSubmit={handleLogin} style={styles.formContainer}>
                <div style={styles.underlineInputGroup}>
                  <label style={styles.fieldLabel}>Username</label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={styles.underlineInput}
                  />
                </div>

                <div style={styles.underlineInputGroup}>
                  <label style={styles.fieldLabel}>University Name</label>
                  <input
                    type="text"
                    placeholder="Enter your university name"
                    value={uniName}
                    onChange={(e) => setUniName(e.target.value)}
                    style={styles.underlineInput}
                  />
                </div>

                {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

                <button type="submit" style={styles.brownPopButton}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEW DASHBOARD INTERFACE */}
      {step === 'dashboard' && (
        <div style={styles.beebotDashboardWrapper}>
          {/* LEFT SIDEBAR */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <div style={styles.logoBadge}>✨</div>
              <h2 style={styles.sidebarBrand}>UNI ASSIST</h2>
            </div>

            {/* Navigation Options */}
            <nav style={styles.navGroup}>
              <div style={{ ...styles.navItem, ...styles.navItemActive }}>
                <span>🏠</span> Home
              </div>
              <div style={styles.navItem}>
                <span>🧩</span> Explore
              </div>
              <div style={styles.navItem}>
                <span>📚</span> Library
              </div>
              <div style={styles.navItem}>
                <span>🕒</span> History
              </div>
            </nav>

            {/* Search History Section */}
            <div style={styles.historySection}>
              <span style={styles.historyCategoryTitle}>Recent Searches</span>
              <div style={styles.historyList}>
                {history.map((item, i) => (
                  <div key={i} style={styles.historyItem}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main style={styles.mainArea}>
            {/* Top Bar with Model Dropdown */}
            <header style={styles.topBar}>
              <div style={styles.modelBadge}>
                <span style={styles.modelIcon}>🤖</span>
                <span style={styles.modelText}>Uni Assist Amity</span>
                <span style={styles.dropdownArrow}>▼</span>
              </div>
            </header>

            {/* Center Chat Viewport */}
            <div style={styles.chatViewport}>
              {messages.length === 0 ? (
                /* HERO GREETING WITH REDUCED FONT SIZES */
                <div style={styles.centerHero}>
                  <h1 style={styles.satisfyGreeting}>
                    Good Morning, {userName || 'Ruchika'}
                  </h1>
                  <h2 style={styles.satisfySubtitle}>
                    How Can I Assist You Today?
                  </h2>
                </div>
              ) : (
                /* MESSAGE STREAM */
                <div style={styles.messagesContainer}>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.chatBubble,
                        alignSelf:
                          msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor:
                          msg.sender === 'user' ? '#3B2314' : '#FFFFFF',
                        color: msg.sender === 'user' ? '#EFE3C3' : '#3B2314',
                      }}
                    >
                      <p style={{ margin: 0 }}>{msg.text}</p>
                      {msg.citation && (
                        <span style={styles.citationTag}>
                          Source: {msg.citation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* FLOATING PROMPT INPUT */}
              <form
                onSubmit={handleSendMessage}
                style={styles.floatingInputCard}
              >
                <input
                  type="text"
                  placeholder="Initiate a query or send a command..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={styles.cleanPromptInput}
                />
                <button type="submit" style={styles.sendButtonPill}>
                  Send ➔
                </button>
              </form>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    width: '100vw',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflowX: 'hidden',
    margin: 0,
    padding: 0,
  },

  /* SPLASH STYLES */
  pistaContainer: {
    minHeight: '100vh',
    backgroundColor: '#EFE3C3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  horizontalLine: {
    height: '3px',
    backgroundColor: '#3B2314',
    borderRadius: '2px',
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  splashTitle: {
    margin: 0,
  },

  /* LOGIN SCREEN STYLES */
  outerScreenContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#EFE3C3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  floatingSplitCard: {
    display: 'flex',
    width: '100%',
    maxWidth: '960px',
    minHeight: '560px',
    backgroundColor: '#3B2314',
    borderRadius: '32px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(59, 35, 20, 0.18)',
  },
  leftBrownSection: {
    flex: 1,
    backgroundColor: '#3B2314',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBrandHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  brandTitleText: {
    fontWeight: '800',
    fontSize: '1.5rem',
    color: '#EFE3C3',
    letterSpacing: '1px',
  },
  centerBrandContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto 0',
    textAlign: 'center',
  },
  amityCenterTitle: {
    fontFamily: "'Cinzel', Georgia, serif",
    fontSize: '2rem',
    fontWeight: '600',
    color: '#EFE3C3',
    letterSpacing: '3px',
    margin: '0 0 0.8rem 0',
    textTransform: 'uppercase',
  },
  centerDividerLine: {
    width: '60px',
    height: '1px',
    backgroundColor: 'rgba(239, 227, 195, 0.4)',
  },
  bottomQuoteContainer: {
    marginTop: 'auto',
  },
  italiannoQuote: {
    fontFamily: "'Italianno', cursive",
    fontSize: '2.5rem',
    color: '#EFE3C3',
    margin: 0,
    lineHeight: '1.2',
  },
  rightCreamCard: {
    flex: 1.1,
    backgroundColor: '#FAF5EA',
    borderTopLeftRadius: '36px',
    borderBottomLeftRadius: '36px',
    padding: '3.5rem 3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  headerSection: {
    marginBottom: '2.5rem',
  },
  welcomeTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#3B2314',
    margin: '0 0 0.5rem 0',
  },
  subtextHeading: {
    fontSize: '0.9rem',
    color: '#5A3D28',
    margin: 0,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  underlineInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  fieldLabel: {
    fontSize: '0.85rem',
    color: '#5A3D28',
    fontWeight: '700',
  },
  underlineInput: {
    width: '100%',
    padding: '0.6rem 0',
    border: 'none',
    borderBottom: '1.5px solid #D1C5A8',
    outline: 'none',
    fontSize: '1rem',
    color: '#3B2314',
    backgroundColor: 'transparent',
  },
  brownPopButton: {
    width: '100%',
    padding: '0.95rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#3B2314',
    color: '#EFE3C3',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 5px 0px #24140B, 0 8px 15px rgba(0, 0, 0, 0.15)',
  },
  errorText: {
    color: '#DC2626',
    fontSize: '0.85rem',
    margin: 0,
    fontWeight: '600',
  },

  /* BEEBOT STYLE DASHBOARD WITH PISTA & DARK BROWN PALETTE */
  beebotDashboardWrapper: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#EFE3C3',
    color: '#3B2314',
    overflow: 'hidden',
  },
  sidebar: {
    width: '260px',
    backgroundColor: 'rgba(250, 245, 234, 0.7)',
    borderRight: '1px solid rgba(59, 35, 20, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    boxSizing: 'border-box',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '2rem',
  },
  logoBadge: {
    fontSize: '1.2rem',
  },
  sidebarBrand: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#3B2314',
    margin: 0,
    letterSpacing: '0.5px',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    marginBottom: '2rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.65rem 0.9rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#5A3D28',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  navItemActive: {
    backgroundColor: '#3B2314',
    color: '#EFE3C3',
  },
  historySection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  historyCategoryTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#8A6B52',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '0.8rem',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    overflowY: 'auto',
  },
  historyItem: {
    fontSize: '0.85rem',
    color: '#5A3D28',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: '0.2rem 0',
  },

  /* MAIN AREA */
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.2rem 2rem',
  },
  modelBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#FAF5EA',
    border: '1px solid rgba(59, 35, 20, 0.15)',
    borderRadius: '20px',
    padding: '0.4rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#3B2314',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  },
  modelIcon: {
    fontSize: '1rem',
  },
  modelText: {
    marginRight: '0.2rem',
  },
  dropdownArrow: {
    fontSize: '0.65rem',
    opacity: 0.6,
  },

  /* CHAT VIEWPORT */
  chatViewport: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem 2.5rem 2rem',
    maxWidth: '850px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  centerHero: {
    textAlign: 'center',
    margin: 'auto 0',
  },
  satisfyGreeting: {
    fontFamily: "'Satisfy', cursive",
    fontSize: '2rem',
    color: '#3B2314',
    margin: '0 0 0.2rem 0',
    fontWeight: '400',
  },
  satisfySubtitle: {
    fontFamily: "'Satisfy', cursive",
    fontSize: '1.8rem',
    color: '#5A3D28',
    margin: 0,
    fontWeight: '400',
  },
  messagesContainer: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflowY: 'auto',
    marginBottom: '1.5rem',
    paddingRight: '0.5rem',
  },
  chatBubble: {
    maxWidth: '75%',
    padding: '1rem 1.3rem',
    borderRadius: '18px',
    lineHeight: '1.5',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  },
  citationTag: {
    display: 'block',
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    opacity: 0.8,
  },

  /* FLOATING PROMPT CARD */
  floatingInputCard: {
    width: '100%',
    backgroundColor: '#FAF5EA',
    borderRadius: '24px',
    padding: '0.8rem 1.2rem',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid rgba(59, 35, 20, 0.12)',
    boxShadow: '0 12px 30px rgba(59, 35, 20, 0.08)',
    boxSizing: 'border-box',
  },
  cleanPromptInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    color: '#3B2314',
    padding: '0.5rem 0.5rem',
  },
  sendButtonPill: {
    backgroundColor: '#3B2314',
    color: '#EFE3C3',
    border: 'none',
    borderRadius: '20px',
    padding: '0.6rem 1.2rem',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
};
