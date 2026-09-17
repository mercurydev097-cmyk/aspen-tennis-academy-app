import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function SignUp() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate("/home"), 400);
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="bg-navy-900 px-7 pb-8 pt-10 text-white">
        <div className="mb-6 flex items-center gap-2.5">
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
        <h1 className="text-[26px] font-extrabold leading-tight">Create your family account</h1>
        <p className="mt-1 text-[13px] text-white/60">
          One account gets everyone on the court.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-7 pb-10 pt-7">
        <div className="flex flex-col gap-4">
          <Input label="Full name" placeholder="Sarah Mitchell" required />
          <Input label="Email" type="email" placeholder="you@email.com" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          <Input label="Confirm password" type="password" placeholder="••••••••" required />
        </div>

        <div className="mt-auto pt-8">
          <Button fullWidth type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
          <p className="mt-4 text-center text-[13px] text-ink-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="font-semibold text-pine-600"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
