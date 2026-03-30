function ProblemCard({ problem, onToggleImportant, onOpenNotes, onClick }) {
  const formattedDate = new Date(problem.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div
      className="glass glass-hover rounded-2xl p-3 sm:p-4 transition-all duration-300 group hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer"
      onClick={() => onClick?.(problem)}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Important Star */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleImportant(problem._id, !problem.isImportant);
          }}
          className="flex-shrink-0 transition-colors"
          title={problem.isImportant ? "Unmark important" : "Mark important"}
        >
          {problem.isImportant ? (
            <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-600 hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </button>

        {/* Problem Number */}
        <div className="flex-shrink-0 w-12 sm:w-14 text-center">
          {problem.number ? (
            <span className="text-xs font-mono text-violet-400/80 bg-violet-500/10 px-2 py-1 rounded-lg">
              #{problem.number}
            </span>
          ) : (
            <span className="text-xs text-slate-600">&mdash;</span>
          )}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-violet-300 transition-colors">
            {problem.name}
          </h3>
        </div>

        {/* Topics */}
        <div className="hidden md:flex flex-shrink-0 items-center gap-1.5 max-w-[240px]">
          {problem.topics && problem.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20 whitespace-nowrap"
            >
              {topic}
            </span>
          ))}
          {problem.topics && problem.topics.length > 2 && (
            <span className="text-[11px] text-slate-500">+{problem.topics.length - 2}</span>
          )}
        </div>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          {problem.leetcodeLink && (
            <a
              href={problem.leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 text-[11px] font-medium rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              title="LeetCode"
            >
              LC
            </a>
          )}
          {problem.gfgLink && (
            <a
              href={problem.gfgLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 text-[11px] font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              title="GeeksforGeeks"
            >
              GFG
            </a>
          )}
        </div>

        {/* Notes Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenNotes(problem);
          }}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            problem.notes
              ? "text-violet-400 bg-violet-500/10 hover:bg-violet-500/20"
              : "text-slate-600 hover:text-slate-400 hover:bg-white/5"
          }`}
          title={problem.notes ? "View notes" : "No notes"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        {/* Complexity */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 text-[11px] font-mono text-slate-500">
          {problem.timeComplexity && <span>{problem.timeComplexity}</span>}
          {problem.timeComplexity && problem.spaceComplexity && <span>|</span>}
          {problem.spaceComplexity && <span>{problem.spaceComplexity}</span>}
        </div>

        {/* Date */}
        <span className="hidden sm:block flex-shrink-0 text-[11px] text-slate-500 w-20 text-right">
          {formattedDate}
        </span>

        {/* Arrow */}
        <div className="hidden sm:flex flex-shrink-0">
          <svg
            className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Mobile: Topics + Links row */}
      <div className="flex md:hidden flex-wrap items-center gap-1.5 mt-2.5 pl-9">
        {problem.topics && problem.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20"
          >
            {topic}
          </span>
        ))}
        {problem.leetcodeLink && (
          <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer"
            className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">LC</a>
        )}
        {problem.gfgLink && (
          <a href={problem.gfgLink} target="_blank" rel="noopener noreferrer"
            className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">GFG</a>
        )}
      </div>
    </div>
  );
}

export default ProblemCard;
