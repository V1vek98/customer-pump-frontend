export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="relative h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,194,51,1), rgba(255,160,40,0.95))",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.55) inset, 0 6px 18px -6px rgba(255,160,40,0.55)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-[#1D1D1F]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 5.4 L12 3" />
          <path d="M12 18.6 L12 21" />
          <path d="M5.4 12 L3 12" />
          <path d="M18.6 12 L21 12" />
          <path d="M7.4 7.4 L5.6 5.6" />
          <path d="M16.6 16.6 L18.4 18.4" />
          <path d="M16.6 7.4 L18.4 5.6" />
          <path d="M7.4 16.6 L5.6 18.4" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-semibold tracking-tight text-[#1D1D1F]">GIW Fleet</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#86868B] mt-0.5">KSB · Operations</span>
      </div>
    </div>
  );
}
