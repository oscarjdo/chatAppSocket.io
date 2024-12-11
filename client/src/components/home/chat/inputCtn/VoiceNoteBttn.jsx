import React from "react";

import { AiFillAudio } from "react-icons/ai";

function VoiceNoteBttn() {
  // const getUserMedia=()=>{
  //   navigator.mediaDevices
  //   .getUserMedia({
  //     video: false,
  //     audio: true,
  //   })
  //   .then((stream) => {
  //     videoTarget.current.srcObject = stream;
  //     setMediaStream(stream);
  //     setMediaRecorder(new MediaRecorder(stream));
  //   })
  //   .catch((err) => console.error(err));
  // }

  return (
    <button type="button" className="voiceNote">
      <AiFillAudio className="send-mssg-icon voice-note" />
    </button>
  );
}

export default VoiceNoteBttn;
