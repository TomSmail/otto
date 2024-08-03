import { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder-2';
import axios from 'axios';
// import AudioPlayer from './PlayAudio';

const AUDIO_START_TEXT = 'Speak';

// If developing locally use set LOCAL env var
const WEBSITE_URL = 'http://127.0.0.1:5000/' + 'api/post_audio';

// Function packages audio blob and sends it to globally defined URL
async function uploadAudio(blobUrl) {
  console.log('Uploading');
  console.log(WEBSITE_URL);
  // Construct the form data to be sent
  const formData = new FormData();
  if (blobUrl !== null) {
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());
    formData.append('audio', audioBlob);
  } else {
    console.log('Error: blob url not present');
  }

  // Send the form data
  try {
    const response = await fetch(WEBSITE_URL, {
      method: 'POST',
      body: formData
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    console.log('Cleaning up!');
  }
}

export function AudioRecordButton() {
  const [recording, setRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState('');
  const [buttonText, setButtonText] = useState('Start Recording');
  const [audioBlob, setAudioBlob] = useState(null);

  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl) => {
      setMediaBlobUrl(blobUrl);
    }
  });

  useEffect(() => {
    if (mediaBlobUrl) {
      const upload = async () => {
        console.log(`Uploading audio to server: ${mediaBlobUrl}`);

        try {
          const response = await uploadAudio(mediaBlobUrl);

          if (response) {
            console.log('Response received from server, preparing for download.');
            //const blob = new Blob([response], { type: 'audio/mpeg' });
            const blob = await response.blob();
            console.log(blob);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'recorded_audio.mp3';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error('Error uploading or downloading audio:', error);
        }
      };

      upload();
    }
  }, [mediaBlobUrl]);

  const handleClick = () => {
    if (recording) {
      console.log('Stopping Recording');
      stopRecording();
      setRecording(false);
      setButtonText('Start Recording');
    } else {
      console.log('Starting Recording');
      startRecording();
      setRecording(true);
      setButtonText('Stop');
    }
  };

  // const handleClick = () => {
  //   if (recording) {
  //     // Stop
  //     console.log('Stopping Recording');
  //     stopRecording();
  //     setRecording(false);
  //     setButtonText(AUDIO_START_TEXT);
  //   } else {
  //     // Start
  //     console.log('Starting Recording');
  //     startRecording();
  //     setRecording(true);
  //     setButtonText('Stop');
  //   }
  // };

  // // change button text based on recording state
  // return (<>
  //           <button onClick={handleClick}> {buttonText} </button>
  //           {audioBlob && <AudioPlayer audioBlob={audioBlob} />}
  //         </>
  //   );
  // }
  // const handleClick = async () => {
  //   if (recording) {
  //     console.log('Stopping Recording');
  //     setRecording(false);
  //     setButtonText('Start Recording');

  //     try {
  //       const response = await fetch('/api/post_audio', { method: 'POST' });

  //       if (response.ok) {
  //         const blob = await response.blob();
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.style.display = 'none';
  //         a.href = url;
  //         a.download = 'downloaded_audio.mp3';

  //         document.body.appendChild(a);
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //       } else {
  //         console.error('Failed to download audio:', response.statusText);
  //       }
  //     } catch (error) {
  //       console.error('Error during fetch:', error);
  //     }
  //   } else {
  //     console.log('Starting Recording');
  //     setRecording(true);
  //     setButtonText('Stop');
  //   }
  // };

  return (
    <>
      <button onClick={handleClick}>{buttonText}</button>
    </>
  );
}


const AudioPlayer = ({ url }) => {
  const audioRef = useRef(null);
  console.log(url);

  useEffect(() => {

  }, [url]);

  return (
    <div>
      <h1>Auto-play Audio Blob</h1>
      <audio ref={audioRef} src={url} controls autoPlay >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

