import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li>Início</li>
        <li>Tendências</li>
        <li>Inscrições</li>
        <li>Biblioteca</li>
        <li>Histórico</li>
      </ul>
    </aside>
  );
}