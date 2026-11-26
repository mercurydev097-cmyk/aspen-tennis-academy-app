export interface IcsEvent {
  title: string;
  date: string; // yyyy-mm-dd
  startTime: string; // 24h HH:MM
  endTime: string;
  location: string;
  description?: string;
}

const stamp = (d: string, t: string) => `${d.replace(/-/g, "")}T${t.replace(":", "")}00`;
const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export function buildIcs(events: IcsEvent[]) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aspen Tennis Academy//EN", "CALSCALE:GREGORIAN"];
  events.forEach((e, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:aspen-${Date.now()}-${i}@aspentennis`,
      `DTSTAMP:${stamp(e.date, e.startTime)}`,
      `DTSTART;TZID=America/Chicago:${stamp(e.date, e.startTime)}`,
      `DTEND;TZID=America/Chicago:${stamp(e.date, e.endTime)}`,
      `SUMMARY:${esc(e.title)}`,
      `LOCATION:${esc(e.location)}`,
      `DESCRIPTION:${esc(e.description ?? "Aspen Tennis Academy")}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(events: IcsEvent[], name = "aspen-booking.ics") {
  const blob = new Blob([buildIcs(events)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
