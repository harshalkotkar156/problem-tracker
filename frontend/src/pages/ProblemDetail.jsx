import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchProblemById,
  updateProblem,
  deleteProblem,
} from "../services/api";
import { topics } from "../data/topics";
import TopicMultiSelect from "../components/TopicMultiSelect";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notesModal, setNotesModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [tempNotes, setTempNotes] = useState("");

  const loadProblem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProblemById(id);
      setProblem(data);
      setForm({
        name: data.name || "",
        number: data.number || "",
        topics: data.topics || [],
        intuition: data.intuition || "",
        approach: data.approach || "",
        notes: data.notes || "",
        timeComplexity: data.timeComplexity || "",
        spaceComplexity: data.spaceComplexity || "",
        leetcodeLink: data.leetcodeLink || "",
        gfgLink: data.gfgLink || "",
        isImportant: data.isImportant || false,
        code: data.code || "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load problem";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const autoResize = useCallback((el) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.tagName === "TEXTAREA") {
      autoResize(e.target);
    }
  };

  const handleTopicsChange = (newTopics) => {
    setForm((prev) => ({ ...prev, topics: newTopics }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Problem name is required");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateProblem(id, form);
      setProblem(updated);
      toast.success("Saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProblem(id);
      toast.success("Problem deleted!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const openNotesModal = () => {
    setTempNotes(form.notes);
    setNotesModal(true);
  };

  const saveNotes = () => {
    setForm((prev) => ({ ...prev, notes: tempNotes }));
    setNotesModal(false);
  };

  if (loading) return <Loader />;

  if (error && !form) {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-lg mx-auto">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!form) return null;

  const formattedDate = problem
    ? new Date(problem.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const updatedDate = problem
    ? new Date(problem.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="glass rounded-2xl p-6 space-y-5">
        {/* Header with dates */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>Created: {formattedDate}</div>
            <div>Updated: {updatedDate}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Name & Number */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Problem Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Problem Number
            </label>
            <input
              type="text"
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
            />
          </div>
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Topics
          </label>
          <TopicMultiSelect
            options={topics}
            selected={form.topics}
            onChange={handleTopicsChange}
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              LeetCode Link
            </label>
            <input
              type="url"
              name="leetcodeLink"
              value={form.leetcodeLink}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              GFG Link
            </label>
            <input
              type="url"
              name="gfgLink"
              value={form.gfgLink}
              onChange={handleChange}
              placeholder="https://www.geeksforgeeks.org/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
            />
          </div>
        </div>

        {/* Important Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, isImportant: !prev.isImportant }))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              form.isImportant
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill={form.isImportant ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Mark as Important
          </button>
        </div>

        {/* Intuition */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Intuition
          </label>
          <textarea
            name="intuition"
            value={form.intuition}
            onChange={handleChange}
            rows={2}
            placeholder="What was the key insight?"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none overflow-hidden"
            style={{ minHeight: "60px" }}
            ref={(el) => autoResize(el)}
          />
        </div>

        {/* Approach */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Approach
          </label>
          <textarea
            name="approach"
            value={form.approach}
            onChange={handleChange}
            rows={2}
            placeholder="Describe your approach..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none overflow-hidden"
            style={{ minHeight: "60px" }}
            ref={(el) => autoResize(el)}
          />
        </div>

        {/* Notes (with modal edit button) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-300">Notes</label>
            <button
              type="button"
              onClick={openNotesModal}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Expand
            </button>
          </div>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional notes..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Code
          </label>
          <div className="code-block-wrapper rounded-xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/10">
              <span className="text-xs text-slate-500 font-mono">Solution</span>
              {form.code && (
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(form.code); }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              )}
            </div>
            <textarea
              name="code"
              value={form.code}
              onChange={handleChange}
              rows={4}
              placeholder="Paste your code here..."
              className="w-full px-4 py-3 bg-slate-900/60 text-sm text-emerald-300 placeholder-slate-600 focus:outline-none font-mono resize-none overflow-hidden leading-relaxed"
              style={{ minHeight: "100px", tabSize: 4 }}
              ref={(el) => autoResize(el)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Complexity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Time Complexity
            </label>
            <input
              type="text"
              name="timeComplexity"
              value={form.timeComplexity}
              onChange={handleChange}
              placeholder="e.g. O(n)"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Space Complexity
            </label>
            <input
              type="text"
              name="spaceComplexity"
              value={form.spaceComplexity}
              onChange={handleChange}
              placeholder="e.g. O(1)"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Notes Modal */}
      <Modal
        isOpen={notesModal}
        onClose={() => {
          setForm((prev) => ({ ...prev, notes: tempNotes }));
          setNotesModal(false);
        }}
        title="Edit Notes"
      >
        <textarea
          value={tempNotes}
          onChange={(e) => setTempNotes(e.target.value)}
          rows={12}
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
            onClick={saveNotes}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25 transition-all"
          >
            Apply
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete this problem?"
        message="This will permanently remove this problem. This action cannot be undone."
      />
    </div>
  );
}

export default ProblemDetail;
