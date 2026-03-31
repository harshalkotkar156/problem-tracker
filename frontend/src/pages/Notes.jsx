import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchNotes, updateNote } from "../services/api";
import NoteCard from "../components/NoteCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { noteCategories, defaultNoteCategory } from "../data/noteCategories";

function Notes() {
  const ITEMS_PER_PAGE = 20;
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedTagSearch, setDebouncedTagSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultNoteCategory);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    if (!selectedNote) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedNote(null);
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedNote]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTagSearch(tagSearch), 300);
    return () => clearTimeout(timer);
  }, [tagSearch]);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedTagSearch) params.tag = debouncedTagSearch;
      if (selectedCategory) params.category = selectedCategory;
      const data = await fetchNotes(params);
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedTagSearch, selectedCategory]);

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

  const totalPages = Math.max(1, Math.ceil(displayedNotes.length / ITEMS_PER_PAGE));

  const paginatedNotes = displayedNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedTagSearch, selectedCategory, showPinnedOnly]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Notes</h1>
        <p className="text-slate-400">
          Save key points and concepts in Markdown
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="glass rounded-2xl p-4 h-fit lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Categories</h2>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {["ALL", ...noteCategories].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm text-left whitespace-nowrap transition-colors border ${
                  selectedCategory === category
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                    : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <div className="glass rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="relative">
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

              <div className="relative">
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
                    d="M7 7h10M7 12h6m-6 5h8"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by tag..."
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-colors ${
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

              {(search || tagSearch || showPinnedOnly || selectedCategory !== defaultNoteCategory) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setTagSearch("");
                    setShowPinnedOnly(false);
                    setSelectedCategory(defaultNoteCategory);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {!loading && !error && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <span className="text-sm text-slate-500">
                {displayedNotes.length} note{displayedNotes.length !== 1 ? "s" : ""}
                {selectedCategory !== "ALL" ? ` in ${selectedCategory}` : ""}
                {showPinnedOnly && " (pinned)"}
              </span>
              {displayedNotes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 mr-1">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 border border-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Page
                  </button>
                </div>
              )}
            </div>
          )}

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
              title={search || tagSearch || showPinnedOnly || selectedCategory !== defaultNoteCategory ? "No matches found" : "No Notes Yet"}
              message={
                search || tagSearch || showPinnedOnly || selectedCategory !== defaultNoteCategory
                  ? "Try adjusting category, tag, or search filters."
                  : "Click the 'Add Note' button to start capturing your key points!"
              }
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {paginatedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onTogglePin={handleTogglePin}
                  onClick={(note) => setSelectedNote(note)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Note Preview Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedNote(null)}
          />
          {/* Modal */}
          <div className="relative glass rounded-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] shadow-2xl shadow-violet-500/10 flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/10 flex-shrink-0">
              <div className="flex-1 min-w-0 sm:mr-4">
                <h2 className="text-base sm:text-lg font-semibold text-slate-100 truncate">
                  {selectedNote.title}
                </h2>
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedNote(null);
                    navigate(`/note/${selectedNote._id}`);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium text-teal-300 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Body - scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="markdown-preview">
                {selectedNote.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedNote.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-slate-500 italic">This note has no content.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
