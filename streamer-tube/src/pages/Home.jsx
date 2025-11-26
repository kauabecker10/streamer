import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoGrid from "../components/VideoGrid";
import { videos } from "../mockVideos";
import "./Home.css";

export default function Home() {
  const [filtered, setFiltered] = useState(videos);

  function handleSearch(term) {
    setFiltered(
      videos.filter(
        v => v.title.toLowerCase().includes(term.toLowerCase()) || v.channel.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="home-layout">
        <Sidebar />
        <VideoGrid videos={filtered} />
      </div>
    </>
  );
}