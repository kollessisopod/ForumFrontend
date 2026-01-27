import React, { useState } from "react";

export default function AddEntryForm({ onCreate, busy }) {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [localErr, setLocalErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLocalErr("");

    const h = header.trim();
    const d = description.trim();
    const a = author.trim();

    if (!h) return setLocalErr("Header is required.");
    if (!d) return setLocalErr("Description is required.");
    if (!a) return setLocalErr("Author is required.");

    await onCreate({ header: h, description: d, author: a });

    setHeader("");
    setDescription("");
    setAuthor("");
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-title">Add entry</div>

      {localErr ? <div className="form-error">{localErr}</div> : null}

      <label className="label">
        Header
        <input
          className="input"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          placeholder="Entry header"
          disabled={busy}
        />
      </label>

      <label className="label">
        Description
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Entry description"
          rows={4}
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
        {busy ? "Creating..." : "Create entry"}
      </button>
    </form>
  );
}
