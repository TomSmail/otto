from teacher import Teacher
from speech_to_text import WhisperAudioProcessor
from text_to_speech import TextToSpeech

audio_filepath = '/Users/tomsmail/Documents/PersonalProjects/german-buddy/audio-clips/teacher-response.mp3'

class Lesson():
    def __init__(self):
       self.teacher = Teacher("de")
       self.teacher.start_new_conversation()
       self.TTS = TextToSpeech()
       self.STT = WhisperAudioProcessor()
       
    def students_speaks_teacher_responds(self, student_audio_path: str):
        # Decode the student's audio and have the teacher respond
        transcript = self.STT.decode_audio(student_audio_path)
        self.teacher.respond_to_teacher(transcript)
        self.teacher.respond_to_student()
        new_conversation = self.teacher.get_conversation().to_json()
        print(new_conversation)
        self.TTS.convert_text_to_speech(new_conversation[-1]['content']['de'], audio_filepath)
        return new_conversation[-1], audio_filepath