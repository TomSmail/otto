from typing import List
from message import Message

class Conversation:
    def __init__(self, language, messages: List['Message'] = []) -> None:
        self.language = language
        self.__messages = messages

    def add(self, message: 'Message') -> None:
        self.__messages.append(message)

    def get(self) -> List['Message']:
        return self.__messages

    def to_json(self) -> List[dict]:
        return [message.to_json() for message in self.__messages]