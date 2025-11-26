import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoGrid from "../components/VideoGrid";

export default function Home() {
  return (
    <div className="app-layout">
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <VideoGrid />
      </div>
    </div>
  );
}