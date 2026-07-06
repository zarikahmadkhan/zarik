"use client";

import { useState } from "react";
import type { Channel, Person, PersonStatus, RelationshipLane } from "@/lib/types";
import { newId } from "@/lib/storage";

const lanes: { value: RelationshipLane; label: string }[] = [
  { value: "acquaintance", label: "Acquaintance" },
  { value: "potential-friend", label: "Potential friend" },
  { value: "community-contact", label: "Community contact" },
  { value: "dating-marriage-interest", label: "Dating/marriage interest" },
  { value: "professional", label: "Professional" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
];

const statuses: { value: PersonStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "needs-follow-up", label: "Needs follow-up" },
  { value: "active", label: "Active" },
  { value: "dormant", label: "Dormant" },
  { value: "do-not-pursue", label: "Do not pursue" },
];

const channels: { value: Channel; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other" },
];

export default function PersonForm({
  initial,
  onSave,
  onCancel,
  saveLabel = "Save",
}: {
  initial?: Partial<Person>;
  onSave: (person: Person) => void;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [context, setContext] = useState(initial?.context ?? "");
  const [whereMet, setWhereMet] = useState(initial?.whereMet ?? "");
  const [dateMet, setDateMet] = useState(
    initial?.dateMet ?? new Date().toISOString().slice(0, 10)
  );
  const [lane, setLane] = useState<RelationshipLane>(
    initial?.lane ?? "acquaintance"
  );
  const [vibe, setVibe] = useState(initial?.vibe ?? "");
  const [interests, setInterests] = useState(
    (initial?.sharedInterests ?? []).join(", ")
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [channel, setChannel] = useState<Channel>(
    initial?.preferredChannel ?? "whatsapp"
  );
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [handle, setHandle] = useState(initial?.socialHandle ?? "");
  const [status, setStatus] = useState<PersonStatus>(
    initial?.status ?? "needs-follow-up"
  );
  const [cadence, setCadence] = useState(initial?.cadenceDays ?? 14);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: initial?.id ?? newId("person"),
      name: name.trim(),
      context: context.trim() || undefined,
      whereMet: whereMet.trim() || undefined,
      dateMet: dateMet || undefined,
      lane,
      vibe: vibe.trim() || undefined,
      sharedInterests: interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: notes.trim() || undefined,
      preferredChannel: channel,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      socialHandle: handle.trim() || undefined,
      lastContacted: initial?.lastContacted,
      nextFollowUp: initial?.nextFollowUp,
      cadenceDays: cadence,
      status,
      messagesSentWithoutResponse: initial?.messagesSentWithoutResponse ?? 0,
      hasResponded: initial?.hasResponded ?? false,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="p-name" className="label">
          Name
        </label>
        <input
          id="p-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="p-where" className="label">
            Where met
          </label>
          <input
            id="p-where"
            className="input"
            value={whereMet}
            onChange={(e) => setWhereMet(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="p-date" className="label">
            Date met
          </label>
          <input
            id="p-date"
            type="date"
            className="input"
            value={dateMet}
            onChange={(e) => setDateMet(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="p-lane" className="label">
            Lane
          </label>
          <select
            id="p-lane"
            className="input"
            value={lane}
            onChange={(e) => setLane(e.target.value as RelationshipLane)}
          >
            {lanes.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="p-status" className="label">
            Status
          </label>
          <select
            id="p-status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as PersonStatus)}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="p-context" className="label">
          Context <span className="text-fog-500">(who are they?)</span>
        </label>
        <input
          id="p-context"
          className="input"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Runs the pace group, works in logistics"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="p-vibe" className="label">
            Vibe
          </label>
          <input
            id="p-vibe"
            className="input"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Easygoing, dry humor"
          />
        </div>
        <div>
          <label htmlFor="p-interests" className="label">
            Shared interests <span className="text-fog-500">(commas)</span>
          </label>
          <input
            id="p-interests"
            className="input"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="running, coffee"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="p-channel" className="label">
            Preferred channel
          </label>
          <select
            id="p-channel"
            className="input"
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
          >
            {channels.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="p-cadence" className="label">
            Follow-up cadence (days)
          </label>
          <input
            id="p-cadence"
            type="number"
            min={1}
            className="input"
            value={cadence}
            onChange={(e) => setCadence(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="p-phone" className="label">
            Phone <span className="text-fog-500">(optional)</span>
          </label>
          <input
            id="p-phone"
            type="tel"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="p-email" className="label">
            Email <span className="text-fog-500">(optional)</span>
          </label>
          <input
            id="p-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="p-handle" className="label">
          Social handle <span className="text-fog-500">(optional)</span>
        </label>
        <input
          id="p-handle"
          className="input"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@omar.runs"
        />
      </div>
      <div>
        <label htmlFor="p-notes" className="label">
          Notes
        </label>
        <textarea
          id="p-notes"
          className="input min-h-16"
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
