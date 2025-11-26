import React from "react";
import "./VideoCard.css";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  return (
    <div className="video-card" onClick={() => navigate(`/video/${video.id}`)}>
      <img src={video.thumbnail} alt={video.title} />
      <div className="video-info">
        <h4>{video.title}</h4>
        <p>{video.channel} • {video.views} visualizações • {video.date}</p>
      </div>
    </div>
  );
}