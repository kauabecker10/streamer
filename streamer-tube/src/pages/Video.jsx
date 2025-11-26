import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";
import Comments from "../components/Comments";
import { videos } from "../mockVideos";
import "./Video.css";

export default function Video() {
  const { id } = useParams();
  const video = videos.find(v => v.id === id);

  if (!video) return <div>Vídeo não encontrado</div>;

  return (
    <>
      <Header onSearch={() => {}} />
      <div className="video-layout">
        <Sidebar />
        <main style={{ flex: 1 }}>
          <VideoPlayer video={video} />
          <Comments comments={video.comments || []} />
          <Link to="/" className="back-home">← Voltar para Home</Link>
        </main>
      </div>
    </>
  );
}