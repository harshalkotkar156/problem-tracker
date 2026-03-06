function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-purple-400 animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
}

export default Loader;
