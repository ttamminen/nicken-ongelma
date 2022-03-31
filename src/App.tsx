import React, { useCallback } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const onClick = useCallback(async () => {
    await register(await connect());

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
    mediaRecorder.start();
    setTimeout((_event) => {
      console.log("stopping");
      mediaRecorder.stop();
    }, 9000);
    mediaRecorder.ondataavailable = handleDataAvailable;
    console.log(mediaRecorder);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button onClick={onClick}>Record</button>
        </a>
      </header>
    </div>
  );
};

var recordedChunks: any[] = [];

function handleDataAvailable(event: any) {
  console.log("data-available");
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(recordedChunks);
    download(recordedChunks);
  } else {
    // ...
  }
}

function download(recordedChunks: BlobPart[]) {
  var blob = new Blob(recordedChunks, {
    type: "audio/wav",
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  //a.style = "display: none";
  a.href = url;
  a.download = "test.wav";
  a.click();
  window.URL.revokeObjectURL(url);
}

export default App;
