function NoteCard({ note, onTogglePin, onClick }) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Get a brief preview of the content (strip markdown syntax)
  const preview = note.content
    ? note.content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*{1,2}(.*?)\*{1,2}/g, "$1")
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
        .replace(/[-*+]\s/g, "")
        .replace(/>\s/g, "")
        .replace(/\n/g, " ")
        .trim()
        .slice(0, 120)
    : "";

  return (
    <div
      className="glass glass-hover rounded-2xl p-4 transition-all duration-300 group hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer"
      onClick={() => onClick?.(note)}
    >
      <div className="flex items-start gap-4">
        {/* Pin Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin(note._id, !note.isPinned);
          }}
          className="flex-shrink-0 mt-0.5 transition-colors"
          title={note.isPinned ? "Unpin note" : "Pin note"}
        >
          {note.isPinned ? (
            <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-600 hover:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-teal-300 transition-colors">
            {note.title}
          </h3>
          {preview && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {preview}...
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="hidden md:flex flex-shrink-0 items-center gap-1.5 max-w-[240px]">
          {note.tags &&
            note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/20 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          {note.tags && note.tags.length > 2 && (
            <span className="text-[11px] text-slate-500">
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        {/* Markdown indicator */}
        <div className="hidden sm:flex items-center flex-shrink-0">
          <span className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20">
            MD
          </span>
        </div>

        {/* Date */}
        <span className="hidden sm:block flex-shrink-0 text-[11px] text-slate-500 w-20 text-right">
          {formattedDate}
        </span>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <svg
            className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Mobile: Tags row */}
      <div className="flex md:hidden flex-wrap items-center gap-1.5 mt-2.5 pl-9">
        {note.tags &&
          note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/20"
            >
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
}

export default NoteCard;
