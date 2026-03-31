import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchProblems, updateProblem } from "../services/api";
import { topics } from "../data/topics";
import ProblemCard from "../components/ProblemCard";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Dashboard() {
  const ITEMS_PER_PAGE = 20;
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [notesModal, setNotesModal] = useState(false);
  const [notesProblem, setNotesProblem] = useState(null);
  const [tempNotes, setTempNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Close preview modal on Escape key & lock body scroll
  useEffect(() => {
    if (!selectedProblem) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedProblem(null);
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [selectedProblem]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (topicFilter) params.topic = topicFilter;
      const data = await fetchProblems(params);
      setProblems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, topicFilter]);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  const handleToggleImportant = async (id, isImportant) => {
    try {
      await updateProblem(id, { isImportant });
      setProblems((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isImportant } : p))
      );
    } catch (err) {
      toast.error("Failed to toggle important");
    }
  };

  const handleOpenNotes = (problem) => {
    setNotesProblem(problem);
    setTempNotes(problem.notes || "");
    setNotesModal(true);
  };

  const handleSaveNotes = async () => {
    if (!notesProblem) return;
    try {
      setSavingNotes(true);
      await updateProblem(notesProblem._id, { notes: tempNotes });
      setProblems((prev) =>
        prev.map((p) =>
          p._id === notesProblem._id ? { ...p, notes: tempNotes } : p
        )
      );
      setNotesModal(false);
      toast.success("Notes saved!");
    } catch (err) {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const displayedProblems = showImportantOnly
    ? problems.filter((p) => p.isImportant)
    : problems;

  const totalPages = Math.max(
    1,
    Math.ceil(displayedProblems.length / ITEMS_PER_PAGE)
  );

  const paginatedProblems = displayedProblems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, topicFilter, showImportantOnly]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Track and manage your problem-solving journey
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
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
            />
          </div>

          {/* Topic Filter */}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors appearance-none cursor-pointer sm:min-w-[180px]"
          >
            <option value="" className="bg-slate-800">
              All Topics
            </option>
            {topics.map((t) => (
              <option key={t} value={t} className="bg-slate-800">
                {t}
              </option>
            ))}
          </select>

          {/* Important Toggle */}
          <button
            onClick={() => setShowImportantOnly(!showImportantOnly)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-colors ${
              showImportantOnly
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill={showImportantOnly ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Important
          </button>

          {/* Clear Filters */}
          {(search || topicFilter || showImportantOnly) && (
            <button
              onClick={() => {
                setSearch("");
                setTopicFilter("");
                setShowImportantOnly(false);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <span className="text-sm text-slate-500">
            {displayedProblems.length} problem{displayedProblems.length !== 1 ? "s" : ""}
            {showImportantOnly && " (important)"}
          </span>
          {displayedProblems.length > 0 && (
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
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 border border-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadProblems}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : displayedProblems.length === 0 ? (
        <EmptyState
          title={search || topicFilter || showImportantOnly ? "No matches found" : "No Problems Yet"}
          message={
            search || topicFilter || showImportantOnly
              ? "Try adjusting your search or filters."
              : "Click the 'Add Problem' button to get started!"
          }
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {paginatedProblems.map((problem) => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              onToggleImportant={handleToggleImportant}
              onOpenNotes={handleOpenNotes}
              onClick={(p) => setSelectedProblem(p)}
            />
          ))}
        </div>
      )}

      {/* Notes Modal */}
      <Modal
        isOpen={notesModal}
        onClose={() => setNotesModal(false)}
        title={notesProblem ? `Notes — ${notesProblem.name}` : "Notes"}
      >
        <textarea
          value={tempNotes}
          onChange={(e) => setTempNotes(e.target.value)}
          rows={10}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none"
          placeholder="Write your notes here..."
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setNotesModal(false)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25 disabled:opacity-50 transition-all"
          >
            {savingNotes ? "Saving..." : "Save Notes"}
          </button>
        </div>
      </Modal>

      {/* Problem Preview Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProblem(null)}
          />
          {/* Modal */}
          <div className="relative glass rounded-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] shadow-2xl shadow-violet-500/10 flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/10 flex-shrink-0">
              <div className="flex-1 min-w-0 sm:mr-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {selectedProblem.number && (
                    <span className="text-xs font-mono text-violet-400/80 bg-violet-500/10 px-2 py-1 rounded-lg flex-shrink-0">
                      #{selectedProblem.number}
                    </span>
                  )}
                  <h2 className="text-base sm:text-lg font-semibold text-slate-100 truncate">
                    {selectedProblem.name}
                  </h2>
                  {selectedProblem.isImportant && (
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                </div>
                {selectedProblem.topics && selectedProblem.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedProblem.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const id = selectedProblem._id;
                    setSelectedProblem(null);
                    navigate(`/problem/${id}`);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium text-violet-300 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Body - scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
              {/* Links */}
              {(selectedProblem.leetcodeLink || selectedProblem.gfgLink) && (
                <div className="flex flex-wrap gap-2">
                  {selectedProblem.leetcodeLink && (
                    <a
                      href={selectedProblem.leetcodeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                    >
                      LeetCode ↗
                    </a>
                  )}
                  {selectedProblem.gfgLink && (
                    <a
                      href={selectedProblem.gfgLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      GeeksforGeeks ↗
                    </a>
                  )}
                </div>
              )}

              {/* Complexity */}
              {(selectedProblem.timeComplexity || selectedProblem.spaceComplexity) && (
                <div className="flex flex-wrap gap-3">
                  {selectedProblem.timeComplexity && (
                    <span className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 text-slate-300 border border-white/10">
                      Time: {selectedProblem.timeComplexity}
                    </span>
                  )}
                  {selectedProblem.spaceComplexity && (
                    <span className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 text-slate-300 border border-white/10">
                      Space: {selectedProblem.spaceComplexity}
                    </span>
                  )}
                </div>
              )}

              {/* Intuition */}
              {selectedProblem.intuition && (
                <div>
                  <h3 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Intuition
                  </h3>
                  <div className="markdown-preview bg-white/5 rounded-xl p-4 border border-white/10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedProblem.intuition}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Approach */}
              {selectedProblem.approach && (
                <div>
                  <h3 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Approach
                  </h3>
                  <div className="markdown-preview bg-white/5 rounded-xl p-4 border border-white/10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedProblem.approach}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedProblem.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Notes
                  </h3>
                  <div className="markdown-preview bg-white/5 rounded-xl p-4 border border-white/10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedProblem.notes}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Code */}
              {selectedProblem.code && (
                <div>
                  <h3 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code
                  </h3>
                  <div className="markdown-preview">
                    <pre className="bg-slate-900/80 border border-white/10 rounded-xl p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-emerald-300 leading-relaxed">
                        {selectedProblem.code}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!selectedProblem.intuition && !selectedProblem.approach && !selectedProblem.notes && !selectedProblem.code && (
                <p className="text-slate-500 italic text-center py-8">No details added yet. Click Edit to add intuition, approach, and notes.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
