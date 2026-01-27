import React from "react";

export default function EntryList({ entries, selectedId, onSelect }) {
  if (!entries.length) {
    return <div className="muted">No entries found.</div>;
  }

  return (
    <div className="list">
      {entries.map((e) => {
        const id = e.id ?? e.entryId ?? e.uuid ?? e.slug;
        const header = e.header ?? e.title ?? "(no header)";
        const author = e.author ?? "unknown";
        const isSelected = String(id) === String(selectedId);

        return (
          <button
            key={String(id)}
            className={`list-item ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(String(id))}
            type="button"
          >
            <div className="list-item-title">{header}</div>
            <div className="list-item-sub">
              <span className="muted">by</span> <span className="author">{author}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
