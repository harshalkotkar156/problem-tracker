import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createNote } from "../services/api";
import TagInput from "../components/TagInput";
import { noteCategories, defaultNoteCategory } from "../data/noteCategories";

function AddNote() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // "write" | "preview"

  const [form, setForm] = useState({
    title: "",
    category: defaultNoteCategory,
    tags: [],
    content: "",
    isPinned: false,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagsChange = (newTags) => {
    setForm((prev) => ({ ...prev, tags: newTags }));
  };

  const handleContentKeyDown = (e) => {
    if (e.key === "Enter") {
      const textarea = e.target;
      const { selectionStart, value } = textarea;
      const currentLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const currentLine = value.slice(currentLineStart, selectionStart);

      if (currentLine === "- ") {
        // Empty bullet point — remove it
        e.preventDefault();
        const before = value.slice(0, currentLineStart);
        const after = value.slice(selectionStart);
        const newValue = before + after;
        setForm((prev) => ({ ...prev, content: newValue }));
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = currentLineStart;
        }, 0);
      } else if (currentLine.match(/^- .+/)) {
        // Line has content after "- ", add a new bullet
        e.preventDefault();
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionStart);
        const newValue = before + "\n- " + after;
        setForm((prev) => ({ ...prev, content: newValue }));
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 3;
        }, 0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Note title is required");
      return;
    }
    try {
      setSaving(true);
      await createNote(form);
      toast.success("Note created successfully!");
      navigate("/notes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
          Create New Note
        </h1>
        <p className="text-slate-400">
          Write your notes in Markdown — switch to Preview to see the rendered output
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-5">
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
              placeholder="e.g. Binary Search Key Points"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25 transition-colors"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25 transition-colors"
            >
              {noteCategories.map((category) => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
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
                onKeyDown={handleContentKeyDown}
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
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("/notes")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                "Save Note"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddNote;
