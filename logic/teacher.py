# Internal imports
from conversation import Conversation
from message import Message

# External imports
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class Teacher:
    def __init__(self, language: str, conversation: 'Conversation' = []) -> None:
        self.language = language
        self.conversation = conversation
        self.client = OpenAI()
        self.client.api_key = os.environ.get("OPENAI_API_KEY")

    def start_new_conversation(self) -> None:
        # Read the prompt from a file
        with open(f"prompts/{self.language}.txt", "r") as file:
            prompt = file.read()

        message = Message(prompt, "system")
        self.conversation = Conversation(self.language, [message])
    
    def respond_to_student(self) -> None:
        # Query the OpenAI API to get the next response in the conversation
        print(self.conversation.to_json())
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages= self.conversation.to_json()
        )
        response_message = response.choices[0].message.content
        message = Message(response_message, "assistant")

        if os.environ.get("DEBUG"):
            print(message)
            print(f"respond_to_student: {message.assistant_message_to_dict()['en']}")

        self.conversation.add(message)
    
    def respond_to_teacher(self, response: str) -> None:
        message = Message(response, "user")
        self.conversation.add(message)

    def get_conversation(self) -> 'Conversation':
        return self.conversation


if __name__ == '__main__':
    teacher = Teacher("de")
    teacher.start_new_conversation()
    teacher.respond_to_teacher("Hallo, wie geht's? Ich heiße Thomas und meiner Meinung nach ist das Informatik sehr interessant.")
    teacher.respond_to_student()