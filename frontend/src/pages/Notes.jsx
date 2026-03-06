import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchNotes, updateNote } from "../services/api";
import NoteCard from "../components/NoteCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await fetchNotes(params);
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleTogglePin = async (id, isPinned) => {
    try {
      await updateNote(id, { isPinned });
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isPinned } : n))
      );
    } catch (err) {
      toast.error("Failed to toggle pin");
    }
  };

  const displayedNotes = showPinnedOnly
    ? notes.filter((n) => n.isPinned)
    : notes;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Notes</h1>
        <p className="text-slate-400">
          Save key points and concepts in Markdown
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass rounded-2xl p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25 transition-colors"
            />
          </div>

          {/* Pinned Toggle */}
          <button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border transition-colors ${
              showPinnedOnly
                ? "bg-teal-500/15 border-teal-500/30 text-teal-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill={showPinnedOnly ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
            Pinned
          </button>

          {/* Clear Filters */}
          {(search || showPinnedOnly) && (
            <button
              onClick={() => {
                setSearch("");
                setShowPinnedOnly(false);
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-slate-500">
            {displayedNotes.length} note{displayedNotes.length !== 1 ? "s" : ""}
            {showPinnedOnly && " (pinned)"}
          </span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadNotes}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-teal-600 text-white hover:bg-teal-500 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : displayedNotes.length === 0 ? (
        <EmptyState
          title={search || showPinnedOnly ? "No matches found" : "No Notes Yet"}
          message={
            search || showPinnedOnly
              ? "Try adjusting your search or filters."
              : "Click the 'Add Note' button to start capturing your key points!"
          }
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {displayedNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
