from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
import sys
import os
import tempfile

sys.path.append('/Users/tomsmail/german-buddy/logic')

from lesson import Lesson

app = Flask(__name__, static_folder='./frontend/build')
CORS(app)



@app.route('/api/post_audio', methods=['POST', 'GET'])
def post_audio():

    transcription, audio_path = extract_transcript(request)
    # audio_path = "/Users/tomsmail/german-buddy/audio-clips/teacher-response.mp3"
    return send_file(audio_path, mimetype="audio/mpeg", as_attachment=True, download_name="audio-file"), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


def extract_transcript(request):
    print(request.files)
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file attached in the request'}), 400

    audio = request.files['audio']
    if audio.filename == '':
        return jsonify({'error': 'Audio filename is blank'}), 400

    # Create a temporary file
    temp = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    temp.write(audio.read())
    temp.flush()  # Ensure all data is written to the file

    # Get the temporary file path
    temp_file_path = temp.name

    print(temp_file_path)

    lesson = Lesson()

    response, audio_path = lesson.students_speaks_teacher_responds(temp_file_path)
    return response, audio_path


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
