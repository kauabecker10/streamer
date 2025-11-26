import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoUrl }) => (
  <div className="video-player">
    <iframe
      width="100%"
      height="500"
      src={videoUrl}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
      title="Vídeo"
    />
  </div>
);

export default VideoPlayer;