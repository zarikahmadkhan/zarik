"use client";

import { useState } from "react";
import type { EventStatus, EventType, OrbitEvent } from "@/lib/types";
import { newId } from "@/lib/storage";

const eventTypes: { value: EventType; label: string }[] = [
  { value: "run-club", label: "Run club" },
  { value: "book-club", label: "Book club" },
  { value: "comic-club", label: "Comic club" },
  { value: "improv-class", label: "Improv/acting" },
  { value: "faith-community", label: "Faith/community" },
  { value: "volunteer", label: "Volunteering" },
  { value: "museum", label: "Museum/culture" },
  { value: "board-games", label: "Board games" },
  { value: "bookstore", label: "Bookstore event" },
  { value: "fitness-class", label: "Fitness class" },
  { value: "professional", label: "Professional" },
  { value: "coffee-night", label: "Coffee night" },
  { value: "walk-group", label: "Walk group" },
  { value: "concert", label: "Concert" },
  { value: "food-market", label: "Food/night market" },
  { value: "class-workshop", label: "Class/workshop" },
  { value: "other", label: "Other" },
];

function ScoreInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}: <span className="text-fog-50">{value}/5</span>
      </label>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-moss-500"
      />
    </div>
  );
}

export default function EventForm({
  initial,
  onSave,
  onCancel,
  saveLabel = "Save event",
}: {
  initial?: Partial<OrbitEvent>;
  onSave: (event: OrbitEvent) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState(initial?.startTime ?? "");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [neighborhood, setNeighborhood] = useState(
    initial?.neighborhood ?? ""
  );
  const [cost, setCost] = useState(initial?.cost ?? 0);
  const [url, setUrl] = useState(initial?.url ?? "");
  const [eventType, setEventType] = useState<EventType>(
    initial?.eventType ?? "other"
  );
  const [vibeTags, setVibeTags] = useState(
    (initial?.vibeTags ?? []).join(", ")
  );
  const [soloFriendliness, setSoloFriendliness] = useState(
    initial?.soloFriendliness ?? 3
  );
  const [conversationPotential, setConversationPotential] = useState(
    initial?.conversationPotential ?? 3
  );
  const [repeatPotential, setRepeatPotential] = useState(
    initial?.repeatPotential ?? 3
  );
  const [socialDifficulty, setSocialDifficulty] = useState(
    initial?.socialDifficulty ?? 3
  );
  const [isRecurring, setIsRecurring] = useState(
    initial?.isRecurring ?? false
  );
  const [status, setStatus] = useState<EventStatus>(
    initial?.status ?? "interested"
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: initial?.id ?? newId("event"),
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      neighborhood: neighborhood.trim() || undefined,
      cost,
      url: url.trim() || undefined,
      eventType,
      vibeTags: vibeTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      soloFriendliness,
      conversationPotential,
      repeatPotential,
      socialDifficulty,
      isRecurring,
      timesAttended: initial?.timesAttended ?? 0,
      notes: notes.trim() || undefined,
      status,
      reflection: initial?.reflection,
      skipReflection: initial?.skipReflection,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="ev-title" className="label">
          Title
        </label>
        <input
          id="ev-title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ev-date" className="label">
            Date
          </label>
          <input
            id="ev-date"
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="ev-type" className="label">
            Type
          </label>
          <select
            id="ev-type"
            className="input"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
          >
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ev-start" className="label">
            Starts
          </label>
          <input
            id="ev-start"
            type="time"
            className="input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ev-end" className="label">
            Ends <span className="text-fog-500">(optional)</span>
          </label>
          <input
            id="ev-end"
            type="time"
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ev-loc" className="label">
            Location
          </label>
          <input
            id="ev-loc"
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ev-hood" className="label">
            Neighborhood
          </label>
          <input
            id="ev-hood"
            className="input"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ev-cost" className="label">
            Cost ($)
          </label>
          <input
            id="ev-cost"
            type="number"
            min={0}
            className="input"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="ev-status" className="label">
            Status
          </label>
          <select
            id="ev-status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as EventStatus)}
          >
            <option value="interested">Interested</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="ev-url" className="label">
          URL <span className="text-fog-500">(optional)</span>
        </label>
        <input
          id="ev-url"
          type="url"
          className="input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>
      <div>
        <label htmlFor="ev-vibes" className="label">
          Vibe tags <span className="text-fog-500">(comma-separated)</span>
        </label>
        <input
          id="ev-vibes"
          className="input"
          value={vibeTags}
          onChange={(e) => setVibeTags(e.target.value)}
          placeholder="outdoors, small-group"
        />
      </div>
      <label className="flex min-h-tap items-center gap-3 text-sm text-fog-200">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="h-5 w-5 accent-moss-500"
        />
        Recurring event (weekly/monthly — weighted heavily in scoring)
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ScoreInput
          id="ev-solo"
          label="Solo-friendliness"
          value={soloFriendliness}
          onChange={setSoloFriendliness}
        />
        <ScoreInput
          id="ev-conv"
          label="Conversation potential"
          value={conversationPotential}
          onChange={setConversationPotential}
        />
        <ScoreInput
          id="ev-repeat"
          label="Repeat potential"
          value={repeatPotential}
          onChange={setRepeatPotential}
        />
        <ScoreInput
          id="ev-diff"
          label="Social difficulty"
          value={socialDifficulty}
          onChange={setSocialDifficulty}
        />
      </div>
      <div>
        <label htmlFor="ev-notes" className="label">
          Notes
        </label>
        <textarea
          id="ev-notes"
          className="input min-h-20"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1">
          {saveLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
