import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProblems, updateProblem } from "../services/api";
import { topics } from "../data/topics";
import ProblemCard from "../components/ProblemCard";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Dashboard() {
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
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
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors appearance-none cursor-pointer min-w-[180px]"
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
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 border transition-colors ${
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
            {displayedProblems.length} problem{displayedProblems.length !== 1 ? "s" : ""}
            {showImportantOnly && " (important)"}
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
          {displayedProblems.map((problem) => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              onToggleImportant={handleToggleImportant}
              onOpenNotes={handleOpenNotes}
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
    </div>
  );
}

export default Dashboard;
