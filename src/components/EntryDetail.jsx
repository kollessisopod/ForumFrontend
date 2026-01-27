import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEntry, fetchComments, createComment } from "../api.js";
import Loading from "./Loading.jsx";
import ErrorBanner from "./ErrorBanner.jsx";
import AddCommentForm from "./AddCommentForm.jsx";

export default function EntryDetail() {
  const { id } = useParams();

  const [entry, setEntry] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingEntry, setLoadingEntry] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [err, setErr] = useState("");

  const [posting, setPosting] = useState(false);

  const loadComments = async () => {
    const data = await fetchComments(id);
    setComments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let alive = true;
    setErr("");
    setLoadingEntry(true);
    setEntry(null);

    fetchEntry(id)
      .then((data) => {
        if (!alive) return;
        setEntry(data);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || String(e));
      })
      .finally(() => {
        if (!alive) return;
        setLoadingEntry(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    setLoadingComments(true);
    setComments([]);

    loadComments()
      .catch((e) => {
        if (!alive) return;
        setErr((prev) => prev || (e?.message || String(e)));
      })
      .finally(() => {
        if (!alive) return;
        setLoadingComments(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const onCreatedComment = async ({ content, author }) => {
    setErr("");
    setPosting(true);
    try {
      await createComment(id, { content, author });
      await loadComments();
    } catch (e) {
      setErr(e?.message || String(e));
      throw e;
    } finally {
      setPosting(false);
    }
  };

  if (err) return <ErrorBanner message={err} />;

  if (loadingEntry) return <Loading label="Loading entry" />;

  if (!entry) {
    return (
      <div className="panel">
        <div className="panel-title">Entry not found</div>
        <div className="panel-body muted">The backend returned no entry for this id.</div>
      </div>
    );
  }

  const header = entry.header ?? entry.title ?? "(no header)";
  const description = entry.description ?? entry.body ?? "";
  const author = entry.author ?? "unknown";

  return (
    <div className="detail">
      <div className="detail-main">
        <div className="panel">
          <div className="panel-title">{header}</div>
          <div className="panel-sub">
            <span className="muted">Author</span> <span className="author">{author}</span>
          </div>
          <div className="panel-body">{description || <span className="muted">(no description)</span>}</div>
        </div>

        <div className="panel">
          <div className="panel-title">Comments</div>

          {loadingComments ? (
            <div className="panel-body">
              <Loading label="Loading comments" />
            </div>
          ) : comments.length ? (
            <div className="comments">
              {comments.map((c, idx) => {
                const cid = c.id ?? c.commentId ?? `${idx}`;
                const content = c.content ?? c.comment ?? "";
                const cauthor = c.author ?? "unknown";
                return (
                  <div className="comment" key={String(cid)}>
                    <div className="comment-meta">
                      <span className="muted">Author</span> <span className="author">{cauthor}</span>
                    </div>
                    <div className="comment-body">{content || <span className="muted">(empty)</span>}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="panel-body muted">No comments.</div>
          )}
        </div>
      </div>

      <div className="detail-sidebar">
        <div className="panel">
          <AddCommentForm onCreate={onCreatedComment} busy={posting} />
        </div>
      </div>
    </div>
  );
}
