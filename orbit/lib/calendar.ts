import type { OrbitEvent } from "@/lib/types";

// Lightweight calendar handoff: .ics file + Google Calendar template link.
// No OAuth, no API — the user's calendar app does the work.

function toIcsStamp(date: string, time?: string): string {
  const t = (time ?? "19:00").replace(":", "");
  return `${date.replaceAll("-", "")}T${t}00`;
}

function endStamp(event: OrbitEvent): string {
  if (event.endTime) return toIcsStamp(event.date, event.endTime);
  // default: 90 minutes after start
  const [h, m] = (event.startTime ?? "19:00").split(":").map(Number);
  const end = new Date(2000, 0, 1, h, m + 90);
  const hh = String(end.getHours()).padStart(2, "0");
  const mm = String(end.getMinutes()).padStart(2, "0");
  return toIcsStamp(event.date, `${hh}:${mm}`);
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(event: OrbitEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Orbit//v0.1//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@orbit.local`,
    `DTSTAMP:${toIcsStamp(new Date().toISOString().slice(0, 10))}`,
    `DTSTART:${toIcsStamp(event.date, event.startTime)}`,
    `DTEND:${endStamp(event)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
  ];
  const loc = [event.location, event.neighborhood].filter(Boolean).join(", ");
  if (loc) lines.push(`LOCATION:${escapeIcs(loc)}`);
  if (event.notes) lines.push(`DESCRIPTION:${escapeIcs(event.notes)}`);
  if (event.url) lines.push(`URL:${event.url}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(event: OrbitEvent): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/[^\w-]+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(event: OrbitEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toIcsStamp(event.date, event.startTime)}/${endStamp(event)}`,
  });
  const loc = [event.location, event.neighborhood].filter(Boolean).join(", ");
  if (loc) params.set("location", loc);
  if (event.notes || event.url) {
    params.set("details", [event.notes, event.url].filter(Boolean).join("\n"));
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
