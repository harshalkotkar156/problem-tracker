import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchNoteById, updateNote, deleteNote } from "../services/api";
import TagInput from "../components/TagInput";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // "write" | "preview"

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNoteById(id);
      setNote(data);
      setForm({
        title: data.title || "",
        tags: data.tags || [],
        content: data.content || "",
        isPinned: data.isPinned || false,
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load note";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagsChange = (newTags) => {
    setForm((prev) => ({ ...prev, tags: newTags }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Note title is required");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateNote(id, form);
      setNote(updated);
      toast.success("Saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(id);
      toast.success("Note deleted!");
      navigate("/notes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <Loader />;

  if (error && !form) {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-lg mx-auto">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate("/notes")}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-teal-600 text-white hover:bg-teal-500 transition-colors"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  if (!form) return null;

  const formattedDate = note
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const updatedDate = note
    ? new Date(note.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/notes")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Notes
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

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25 transition-colors"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Tags
            <span className="text-xs text-slate-500 ml-2">
              Press Enter or comma to add
            </span>
          </label>
          <TagInput
            tags={form.tags}
            onChange={handleTagsChange}
            placeholder="e.g. Binary Search, Arrays, DP..."
          />
        </div>

        {/* Pin Toggle */}
        <div>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, isPinned: !prev.isPinned }))
            }
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              form.isPinned
                ? "bg-teal-500/15 border-teal-500/30 text-teal-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={form.isPinned ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"
              />
            </svg>
            Pin this Note
          </button>
        </div>

        {/* Markdown Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-300">
              Content
            </label>
            {/* Tab Switcher */}
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === "write"
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={16}
              placeholder={`# My Notes\n\n## Key Points\n- Point one\n- Point two\n\n## Code Example\n\`\`\`js\nconst x = 42;\n\`\`\`\n\nWrite in **Markdown** format...`}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25 transition-colors resize-none font-mono leading-relaxed"
              style={{ minHeight: "400px" }}
              spellCheck={false}
            />
          ) : (
            <div
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 overflow-y-auto markdown-preview"
              style={{ minHeight: "400px" }}
            >
              {form.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.content}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-500 italic">
                  Nothing to preview yet. Switch to Write tab and start
                  typing...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate("/notes")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        message="This will permanently remove this note. This action cannot be undone."
      />
    </div>
  );
}

export default NoteDetail;
