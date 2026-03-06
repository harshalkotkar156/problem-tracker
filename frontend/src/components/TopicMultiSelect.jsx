import { useState, useRef, useEffect } from "react";

function TopicMultiSelect({ options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (topic) => {
    if (selected.includes(topic)) {
      onChange(selected.filter((t) => t !== topic));
    } else {
      onChange([...selected, topic]);
    }
  };

  const remove = (topic) => {
    onChange(selected.filter((t) => t !== topic));
  };

  return (
    <div ref={ref} className="relative">
      {/* Selected tags + input */}
      <div
        className="w-full rounded-xl px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-text min-h-[44px] bg-slate-800/80 border border-white/15"
        onClick={() => setIsOpen(true)}
      >
        {selected.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/20"
          >
            {t}
            <button
              onClick={(e) => {
                e.stopPropagation();
                remove(t);
              }}
              className="hover:text-white transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? "Select topics..." : ""}
          className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-xl shadow-2xl shadow-black/60 max-h-52 overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-white/15">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">
              No topics found
            </div>
          ) : (
            filtered.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggle(topic)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                  selected.includes(topic)
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {topic}
                {selected.includes(topic) && (
                  <svg
                    className="w-4 h-4 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TopicMultiSelect;
