from UniAssist.pipeline import ask_agent, build_UniAssist_agent


def main():
    print("Building the University Assistant...")

    agent = build_UniAssist_agent()
    print(agent)
    print(type(agent))

    print("Assistant ready!\n")

    question = input("Enter your question:\n")
    answer = ask_agent(agent, question)
    print(answer)


if __name__ == "__main__":
    main()