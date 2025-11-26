import React from "react";
import VideoCard from "./VideoCard";
import "./VideoGrid.css";

const videos = [/* arr de vídeos mockado aqui */];

const VideoGrid = () => (
  <div className="video-grid">
    {videos.map((v, i) => (
      <VideoCard video={v} key={i} />
    ))}
  </div>
);

export default VideoGrid;