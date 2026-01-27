import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { fetchEntries, createEntry } from "./api.js";
import EntryList from "./components/EntryList.jsx";
import EntryDetail from "./components/EntryDetail.jsx";
import Loading from "./components/Loading.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";
import AddEntryForm from "./components/AddEntryForm.jsx";

function EmptyState() {
  return (
    <div className="panel">
      <div className="panel-title">Select an entry</div>
      <div className="panel-body muted">
        Click an entry from the left to view its description and comments.
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="panel">
      <div className="panel-title">Not found</div>
      <div className="panel-body">
        <Link className="link" to="/">Go to home</Link>
      </div>
    </div>
  );
}

function useSelectedEntryId() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/entries\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function Layout({ entries, selectedId, onSelect, onCreatedEntry, creatingEntry }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-dot" />
          <span>Forum</span>
        </div>
        <div className="topbar-meta">
          <span className="badge">Entries</span>
          <span className="muted">{entries.length}</span>
        </div>
      </header>

      <div className="content">
        <aside className="sidebar">
          <div className="sidebar-title">All entries</div>

          <div className="panel" style={{ marginBottom: 12 }}>
            <AddEntryForm onCreate={onCreatedEntry} busy={creatingEntry} />
          </div>

          <EntryList entries={entries} selectedId={selectedId} onSelect={onSelect} />
        </aside>

        <main className="main">
          <Routes>
            <Route path="/" element={<EmptyState />} />
            <Route path="/entries/:id" element={<EntryDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      <footer className="footer">
        <span className="muted">Dark gray, blue, white UI</span>
      </footer>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const selectedId = useSelectedEntryId();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [creatingEntry, setCreatingEntry] = useState(false);

  const loadEntries = async () => {
    const data = await fetchEntries();
    setEntries(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    loadEntries()
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || String(e));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const onSelect = (id) => {
    if (!id) return;
    navigate(`/entries/${encodeURIComponent(id)}`);
  };

  const onCreatedEntry = async ({ header, description, author }) => {
    setErr("");
    setCreatingEntry(true);
    try {
      const created = await createEntry({ header, description, author });
      await loadEntries();

      const newId = created?.id ?? created?.entryId ?? created?.uuid ?? created?.slug;
      if (newId != null) {
        navigate(`/entries/${encodeURIComponent(String(newId))}`);
      }
    } catch (e) {
      setErr(e?.message || String(e));
      throw e; // lets the form keep its own local error behavior consistent
    } finally {
      setCreatingEntry(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Loading label="Loading entries" />
      </div>
    );
  }

  return (
    <div className="page">
      {err ? <ErrorBanner message={err} /> : null}
      <Layout
        entries={entries}
        selectedId={selectedId}
        onSelect={onSelect}
        onCreatedEntry={onCreatedEntry}
        creatingEntry={creatingEntry}
      />
    </div>
  );
}
