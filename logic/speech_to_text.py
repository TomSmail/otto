import whisper
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class WhisperAudioProcessor:
    def __init__(self, model_name: str ="base") -> None:
        self.model = whisper.load_model(model_name)
        self.client = OpenAI()

    # Load and process audio, so it can be used in decoding, pass audio path as input
    def load_and_process_audio(self, audio_path):
        audio = whisper.load_audio(audio_path)
        audio = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio).to(self.model.device)
        return mel

    # Detect the language of the audio, pass audio path as input
    def detect_language(self, audio_path: str):
        mel = self.load_and_process_audio(audio_path)
        _, probs = self.model.detect_language(mel)
        self.detected_language = max(probs, key=probs.get)
        print(f"Detected language: {self.detected_language}")
    
    # Decode the audio, pass audio path as input
    def decode_audio(self, audio_path: str) -> str:
        if os.environ.get("LOCAL") == "True":
            print("Decoding locally")
            return self.__decode_audio_local(audio_path)
        else:
            print("Decoding using OpenAI API")
            return self.__decode_audio_api(audio_path)
    
    # Decode the audio locally, using the whisper library
    def __decode_audio_local(self, audio_path: str):
        mel = self.load_and_process_audio(audio_path)
        options = whisper.DecodingOptions()
        result = whisper.decode(self.model, mel, options)
        print(result.text)
        return result.text

    # Decode the audio using the OpenAI API
    def __decode_audio_api(self, audio_path: str):
        audio_file= open(audio_path, "rb")
        result = self.client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file
        )
        return result.text

# Testing locally in main.py
if __name__ == "__main__":
    processor = WhisperAudioProcessor()
    processor.decode_audio("audio-clips/german-speaking-1.m4a")
    processor.detect_language("audio-clips/german-speaking-1.m4a")
