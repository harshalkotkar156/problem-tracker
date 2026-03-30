import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProblem } from "../services/api";
import { topics } from "../data/topics";
import TopicMultiSelect from "../components/TopicMultiSelect";

function AddProblem() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    number: "",
    topics: [],
    intuition: "",
    approach: "",
    notes: "",
    timeComplexity: "",
    spaceComplexity: "",
    leetcodeLink: "",
    gfgLink: "",
    isImportant: false,
    code: "",
  });

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

  const handleBulletKeyDown = (e) => {
    if (e.key === "Enter") {
      const textarea = e.target;
      const { selectionStart, value } = textarea;
      const currentLineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const currentLine = value.slice(currentLineStart, selectionStart);

      if (currentLine === "- ") {
        e.preventDefault();
        const before = value.slice(0, currentLineStart);
        const after = value.slice(selectionStart);
        const newValue = before + after;
        setForm((prev) => ({ ...prev, [textarea.name]: newValue }));
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = currentLineStart;
        }, 0);
      } else if (currentLine.match(/^- .+/)) {
        e.preventDefault();
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionStart);
        const newValue = before + "\n- " + after;
        setForm((prev) => ({ ...prev, [textarea.name]: newValue }));
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 3;
        }, 0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Problem name is required");
      return;
    }
    try {
      setSaving(true);
      await createProblem(form);
      toast.success("Problem added successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save problem");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
          Add New Problem
        </h1>
        <p className="text-slate-400">
          Record a problem and your approach to it
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-5">
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
                placeholder="e.g. Two Sum"
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
                placeholder="e.g. 1"
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
              onKeyDown={handleBulletKeyDown}
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
              onKeyDown={handleBulletKeyDown}
              rows={2}
              placeholder="Describe your approach..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none overflow-hidden"
              style={{ minHeight: "60px" }}
              ref={(el) => autoResize(el)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              onKeyDown={handleBulletKeyDown}
              rows={3}
              placeholder="Any additional notes..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none overflow-hidden"
              // className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors resize-none"
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
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                "Save Problem"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProblem;
