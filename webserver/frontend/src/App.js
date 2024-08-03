import logo from './logo.svg';
import './App.css';
import Otto from './Otto';
import Navbar from './components/Navbar';
import { AudioRecordButton } from './components/SpeechToText';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Otto></Otto>
      <AudioRecordButton/>
    </div>
  );
}

export default App;
