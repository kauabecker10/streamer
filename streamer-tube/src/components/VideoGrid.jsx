import React from "react";
import VideoCard from "./VideoCard";
import "./VideoGrid.css";

export default function VideoGrid({ videos }) {
  return (
    <div className="video-grid">
      {videos.map((video, i) => (
        <VideoCard video={video} key={video.id || i} />
      ))}
    </div>
  );
}