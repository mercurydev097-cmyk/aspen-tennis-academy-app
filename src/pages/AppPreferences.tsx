import { useState } from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { cn } from "../lib/utils";

const languages = ["English", "Spanish", "French"];

export function AppPreferences() {
  const [language, setLanguage] = useState("English");
  const [showLangPicker, setShowLangPicker] = useState(false);

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="App Preferences" subtitle="Language, privacy, and more." />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">General</p>
      <Card className="mb-6 p-1">
        <button
          onClick={() => setShowLangPicker((s) => !s)}
          className="flex w-full items-center gap-3 p-3.5"
        >
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-navy-900">Language</p>
            <p className="text-[12px] text-ink-500">{language}</p>
          </div>
          <ChevronRight
            size={16}
            className={cn("text-ink-300 transition-transform", showLangPicker && "rotate-90")}
          />
        </button>
        {showLangPicker && (
          <div className="border-t border-ink-100 p-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setShowLangPicker(false);
                }}
                className={cn(
                  "block w-full rounded-lg px-3 py-2.5 text-left text-[13px]",
                  lang === language ? "bg-ink-100 font-semibold text-navy-900" : "text-ink-500"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </Card>

      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">Legal</p>
      <Card className="mb-6 divide-y divide-ink-100 px-1">
        <button className="flex w-full items-center justify-between p-3.5 text-[14px] font-semibold text-navy-900">
          Privacy Policy <ChevronRight size={16} className="text-ink-300" />
        </button>
        <button className="flex w-full items-center justify-between p-3.5 text-[14px] font-semibold text-navy-900">
          Terms of Service <ChevronRight size={16} className="text-ink-300" />
        </button>
      </Card>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-4 text-[14px] font-semibold text-red-600">
        <Trash2 size={15} /> Delete Account
      </button>
    </div>
  );
}
