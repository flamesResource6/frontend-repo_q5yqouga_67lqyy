import Spline from '@splinetool/react-spline';

export default function Header() {
  return (
    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3B7CFF] to-[#04043A]" />
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#04043A]/10 to-[#04043A] pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="text-white/90 tracking-[0.2em] text-xs sm:text-sm">NINETY-NINE</div>
        <h1 className="mt-3 text-white text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight drop-shadow-[0_0_20px_rgba(59,124,255,0.5)]">
          Unified AI Precision Engine — 99% Accuracy
        </h1>
        <p className="mt-3 text-blue-200/80 max-w-2xl">
          A premium multi-model chat that merges GPT-5, Gemini, and Entropy Cloud into one consensus answer.
        </p>
      </div>
    </div>
  );
}
