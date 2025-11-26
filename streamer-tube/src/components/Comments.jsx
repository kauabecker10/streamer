import React from "react";
import "./Comments.css";

export default function Comments({ comments }) {
  return (
    <div className="comments">
      <h3>Comentários</h3>
      {comments.map((c, i) => (
        <div className="comment" key={i}>
          <strong>{c.author}</strong>: {c.text}
        </div>
      ))}
    </div>
  );
}