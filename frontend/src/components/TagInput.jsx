import { useState, useRef, useEffect } from "react";

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const addTag = (value) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={`w-full rounded-xl px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-text min-h-[44px] bg-white/5 border transition-colors ${
        isFocused
          ? "border-violet-500/50 ring-1 ring-violet-500/25"
          : "border-white/10"
      }`}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/20"
        >
          {t}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(t);
            }}
            className="hover:text-white transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          if (input.trim()) addTag(input);
        }}
        placeholder={tags.length === 0 ? placeholder || "Type and press Enter to add tags..." : ""}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500"
      />
    </div>
  );
}

export default TagInput;
