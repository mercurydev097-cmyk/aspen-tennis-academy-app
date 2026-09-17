import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function ScreenHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <button
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className="mb-4 flex items-center gap-1.5 text-[14px] font-medium text-ink-500 hover:text-navy-900"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[26px] font-extrabold leading-tight text-navy-900">{title}</h1>
      {subtitle && <p className="mt-1 text-[13px] text-ink-500">{subtitle}</p>}
    </div>
  );
}
