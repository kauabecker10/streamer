import React from "react";
import "./VideoPlayer.css";

export default function VideoPlayer({ video }) {
  return (
    <div className="video-player-container">
      <iframe
        width="100%"
        height="480"
        src={video.url}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={video.title}
      />
      <div className="video-meta">
        <h2>{video.title}</h2>
        <p>{video.channel} • {video.views} visualizações • {video.date}</p>
        <p>{video.description}</p>
      </div>
    </div>
  );
}