import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ScreenHeader } from "../components/layout/ScreenHeader";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pine-100">
          <MailCheck size={28} className="text-pine-600" />
        </div>
        <h1 className="text-[22px] font-extrabold text-navy-900">Check your email</h1>
        <p className="mt-2 max-w-[260px] text-[14px] text-ink-500">
          We've sent a password reset link to your inbox.
        </p>
        <Button className="mt-8" onClick={() => navigate("/signin")}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col px-7 pt-10">
      <ScreenHeader title="Reset your password" subtitle="We'll email you a reset link." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="flex flex-col gap-4"
      >
        <Input label="Email" type="email" placeholder="you@email.com" required />
        <Button fullWidth type="submit" className="mt-4">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
