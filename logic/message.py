import json
import os
from dotenv import load_dotenv

load_dotenv()

class Message:
    def __init__(self, content: str, role: str) -> None:
        self.content = content
        self.role = role

    def __str__(self) -> str:
        return f"{self.role}: {self.content}"
    
    def to_json(self) -> dict:
        if self.role == "assistant":
            return {'role': self.role, 'content': json.loads(self.content)}
        else:
            return {'role': self.role, 'content': self.content}
    
    def assistant_message_to_dict(self) -> dict:
        if self.role == "assistant":
            unstringified_content = json.loads(self.content)
            return unstringified_content
        else:
            if os.environ.get("DEBUG"):
                print("Message is not a user message")
            return None
    
    