function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 mb-6 rounded-2xl bg-violet-500/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-violet-400/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {title || "No Problems Found"}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm">
        {message || "Start adding problems to track your progress."}
      </p>
    </div>
  );
}

export default EmptyState;
