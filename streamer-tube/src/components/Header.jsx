import React, { useState } from "react";
import "./Header.css";

export default function Header({ onSearch }) {
  const [term, setTerm] = useState("");
  return (
    <header className="header">
      <div className="logo">StreamerTube</div>
      <input
        type="text"
        className="search"
        placeholder="Pesquisar"
        value={term}
        onChange={e => setTerm(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSearch(term)}
      />
      <div className="icons">
        <span role="img" aria-label="bell">🔔</span>
        <span role="img" aria-label="user">👤</span>
      </div>
    </header>
  );
}