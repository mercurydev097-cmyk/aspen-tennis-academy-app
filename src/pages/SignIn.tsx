import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function SignIn() {
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
        <h1 className="text-[26px] font-extrabold leading-tight">Welcome back</h1>
        <p className="mt-1 text-[13px] text-white/60">Good to see you again.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-7 pb-10 pt-7">
        <div className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="you@email.com" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
        </div>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="mt-3 self-end text-[13px] font-semibold text-pine-600"
        >
          Forgot password?
        </button>

        <div className="mt-auto pt-8">
          <Button fullWidth type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
          <p className="mt-4 text-center text-[13px] text-ink-500">
            New here?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-pine-600"
            >
              Create an account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
