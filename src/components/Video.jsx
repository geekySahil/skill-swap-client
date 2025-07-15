import React, { useRef, useEffect } from "react";
import { Box, Grid, Card, CardMedia, IconButton } from "@mui/material";
import {
  FaPhoneAlt,
  FaMicrophoneSlash,
  FaMicrophone,
  FaVideoSlash,
  FaVideo,
  FaCompress,
  FaExpand,
} from "react-icons/fa";
import {
  HiMiniSpeakerWave,
  HiMiniSpeakerXMark,
  HiSpeakerWave,
  HiSpeakerXMark,
} from "react-icons/hi2";
import { useMediaStream } from "../utils/meadiaStreamContext";

function Video({
  stream,
  handleLeaveMeeting,
  handleToggleAudio,
  handleToggleVideo,
  videoMutedStream,
  audioMutedStream,
  handleScreenSize,
  expandedStream,
}) {
  const videoRef = useRef();
  const isVideoTrackEnabledRef = useRef();
  const myStream = useMediaStream();

  useEffect(() => {
    // console.log('video ref', videoRef.current)
    if (videoRef.current && stream) {
      console.log("video", stream);
      videoRef.current.srcObject = stream;
      var videoTracks = stream.getVideoTracks();
    }
    // console.log('videoTracks',  videoTracks)
    isVideoTrackEnabledRef.current =
      videoTracks?.length > 0 && videoTracks[0].enabled;
    // var isVideoTrackEnabled = videoTracks[0].enabled
    // console.log('isvideotrackenabled', isVideoTrackEnabledRef)
  }, [stream, videoMutedStream]);

  // console.log('videoTrackEnabled', isVideoTrackEnabledRef)

  return (
    <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden ">
      <div className="relative w-full h-full border-2 md:border-4 border-cyan-200">
        {isVideoTrackEnabledRef ? (
          <video
            ref={videoRef}
            autoPlay
            muted={audioMutedStream.includes(stream)}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black text-white text-4xl">
            <FaVideoSlash />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-3 z-10">
          {handleLeaveMeeting && (
            <button
              onClick={handleLeaveMeeting}
              className="bg-red-500 text-white rounded-full p-2"
            >
              <FaPhoneAlt />
            </button>
          )}
        </div>
        <div className="absolute bottom-3 right-3 flex gap-3 z-10">
          <button
            onClick={() => handleToggleAudio(stream)}
            className={`bg-gray-500 text-white rounded-lg p-2 ${
              audioMutedStream?.includes(stream)
                ? "bg-gray-400"
                : "hover:bg-blue-600"
            }`}
          >
            {audioMutedStream?.includes(stream) ? (
              <HiSpeakerXMark />
            ) : (
              <HiSpeakerWave />
            )}
          </button>
          <button
            onClick={() => handleToggleVideo(stream)}
            className={`bg-gray-500 text-white rounded-lg p-2 ${
              videoMutedStream?.includes(stream)
                ? "bg-gray-400"
                : "hover:bg-blue-600"
            }`}
          >
            {videoMutedStream?.includes(stream) ? (
              <FaVideoSlash />
            ) : (
              <FaVideo />
            )}
          </button>
          <button
            onClick={() => handleScreenSize(stream)}
            className="bg-gray-500 text-white rounded-lg p-2 hover:bg-blue-600"
          >
            {expandedStream ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Video;
