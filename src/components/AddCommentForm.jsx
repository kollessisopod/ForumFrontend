import React, { useState } from "react";

export default function AddCommentForm({ onCreate, busy }) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [localErr, setLocalErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLocalErr("");

    const c = content.trim();
    const a = author.trim();

    if (!c) return setLocalErr("Comment content is required.");
    if (!a) return setLocalErr("Author is required.");

    await onCreate({ content: c, author: a });

    setContent("");
    setAuthor("");
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-title">Add comment</div>

      {localErr ? <div className="form-error">{localErr}</div> : null}

      <label className="label">
        Comment
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment"
          rows={3}
          disabled={busy}
        />
      </label>

      <label className="label">
        Author
        <input
          className="input"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
          disabled={busy}
        />
      </label>

      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
