import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

const exec = async () => {
  await register(await connect());

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
  mediaRecorder.start();
  setTimeout(() => {
    console.log("stopping");
    mediaRecorder.stop();
  }, 9000);
  mediaRecorder.ondataavailable = handleDataAvailable;
  console.log(mediaRecorder);
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

exec();
