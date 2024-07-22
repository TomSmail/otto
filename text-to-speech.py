from pathlib import Path
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class TextToSpeech:
    def __init__(self) -> None:
        self.client = OpenAI()
        self.client.api_key = os.environ.get("OPENAI_API_KEY")

    def convert_text_to_speech(self, text: str, file_path: str) -> None:
        response = self.client.audio.speech.create(
            model="tts-1",
            voice="onyx",
            input=text
        )
        response.write_to_file(file_path)

if __name__ == "__main__":
    tts = TextToSpeech()
    tts.convert_text_to_speech("meiner Meinung nach ist Informatik sehr interessant.", "audio-clips/hello-how-are-you.mp3")