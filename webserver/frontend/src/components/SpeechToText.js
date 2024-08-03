import { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder-2';

// If developing locally use set LOCAL env var
const WEBSITE_URL = 'http://127.0.0.1:5000/api/post_audio';

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
  const [buttonText, setButtonText] = useState('Start');
  const [audioBlobURL, setAudioBlobURL] = useState(null);

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
            const blob = await response.blob();
            console.log(blob);
            const url = window.URL.createObjectURL(blob);
            setAudioBlobURL(url);
          }
        } catch (error) {
          console.error('Error uploading or downloading audio:', error);
        }
      };

      upload();
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (audioBlobURL) {
      console.log('Playing audio');
      const audioElement = document.createElement('audio');
      audioElement.src = audioBlobURL;
      audioElement.play();
    }
  }, [audioBlobURL]);

  const handleClick = () => {
    if (recording) {
      console.log('Stopping Recording');
      stopRecording();
      setRecording(false);
      setButtonText('Start');
    } else {
      console.log('Starting Recording');
      startRecording();
      setRecording(true);
      setButtonText('Stop');
    }
  };


  return (
    <>
      <button onClick={handleClick}>{buttonText}</button>
    </>
  );
}


