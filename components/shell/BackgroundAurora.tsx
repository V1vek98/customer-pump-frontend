export function BackgroundAurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vh] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,194,51,0.32), rgba(255,194,51,0.04) 60%, transparent 80%)",
          filter: "blur(60px)",
          animation: "auroraA 42s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[30%] -right-[10%] h-[80vh] w-[80vh] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(94,198,255,0.26), rgba(94,198,255,0.02) 60%, transparent 80%)",
          filter: "blur(80px)",
          animation: "auroraB 56s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[20%] h-[60vh] w-[60vh] rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,105,180,0.18), transparent 70%)",
          filter: "blur(70px)",
          animation: "auroraA 64s ease-in-out infinite reverse",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="black" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
