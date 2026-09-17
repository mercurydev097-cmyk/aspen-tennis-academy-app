import { useNavigate } from "react-router-dom";
import { ArrowRight, Mountain, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { CourtPattern } from "../components/layout/CourtPattern";

export function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-full flex-col">
      <div className="relative overflow-hidden bg-navy-900 px-7 pb-10 pt-10 text-white">
        <CourtPattern className="absolute inset-0 h-full w-full opacity-70" />
        <div className="relative">
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Mountain size={18} />
            </div>
            <div>
              <p className="text-[15px] font-extrabold leading-none tracking-wide">ASPEN</p>
              <p className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-white/60">
                TENNIS ACADEMY
              </p>
            </div>
          </div>

          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            The Family Court, Reimagined
          </span>

          <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-tight">
            One login.
            <br />
            Every
            <br />
            court time.
          </h1>

          <p className="mt-5 max-w-[280px] text-[14px] leading-relaxed text-white/60">
            Book your adult classes and your kid's camp in one place. One family
            account, one easy checkout.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Your Family Pass
              </span>
              <Sparkles size={14} className="text-ball" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy-900 bg-navy-700 text-[13px] font-semibold">
                  S
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy-900 bg-gold-500 text-[13px] font-semibold">
                  M
                </div>
              </div>
              <div>
                <p className="text-[13px] font-semibold">Sarah + Max</p>
                <p className="text-[12px] text-white/50">ready for their next rally</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end px-7 pb-10 pt-8">
        <Button fullWidth onClick={() => navigate("/signup")}>
          Continue to Aspen <ArrowRight size={17} />
        </Button>
        <p className="mt-4 text-center text-[13px] text-ink-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="font-semibold text-pine-600"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
