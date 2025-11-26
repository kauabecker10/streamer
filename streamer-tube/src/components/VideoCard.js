import React from "react";
import "./VideoCard.css";

const VideoCard = ({ video }) => (
  <div className="video-card">
    <img src={video.thumbnail} alt={video.title} />
    <div className="video-info">
      <h4>{video.title}</h4>
      <p>{video.channel} • {video.views} visualizações • {video.date}</p>
    </div>
  </div>
);

export default VideoCard;