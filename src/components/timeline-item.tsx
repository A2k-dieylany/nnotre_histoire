"use client";

import { useActionState, useState, useTransition } from "react";
import {
  deleteTimelineEvent,
  updateTimelineEvent,
  type AddEventState,
} from "@/app/timeline-actions";

type Event = {
  id: string;
  title: string;
  body: string | null;
  event_date: string;
  cover_image_url: string | null;
  coverSignedUrl: string | null;
};

export function TimelineItem({ event }: { event: Event }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<AddEventState, FormData>(
    updateTimelineEvent,
    null,
  );
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    if (!confirm(`Supprimer "${event.title}" ? C'est définitif.`)) return;
    startDelete(async () => {
      const result = await deleteTimelineEvent(event.id);
      if (result?.error) alert(result.error);
    });
  }

  if (editing) {
    return (
      <li className="relative">
        <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-white/60" />
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={event.id} />
          <input
            type="text"
            name="title"
            defaultValue={event.title}
            required
            maxLength={120}
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:border-white/50 focus:outline-none"
          />
          <input
            type="date"
            name="event_date"
            defaultValue={event.event_date}
            required
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
          />
          <textarea
            name="body"
            defaultValue={event.body ?? ""}
            rows={3}
            maxLength={2000}
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:border-white/50 focus:outline-none"
          />
          {event.cover_image_url && (
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input type="checkbox" name="remove_cover" />
              Supprimer la photo actuelle
            </label>
          )}
          <input
            type="file"
            name="cover"
            accept="image/*"
            className="text-xs text-white/60 file:mr-3 file:rounded-md file:border file:border-white/20 file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:text-white"
          />
          {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {pending ? "…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-white/10 px-4 py-2 text-xs tracking-wide text-white/60 transition hover:bg-white/10"
            >
              Annuler
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="relative">
      <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-white/60" />
      <time className="text-xs uppercase tracking-widest text-white/40">
        {new Date(event.event_date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h3 className="mt-1 font-serif text-lg italic">{event.title}</h3>
      {event.coverSignedUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- URL signée éphémère, next/image n'apporte rien ici
        <img
          src={event.coverSignedUrl}
          alt=""
          loading="lazy"
          className="mt-3 max-h-72 w-full rounded-md object-cover"
        />
      )}
      {event.body && <p className="mt-1 text-sm text-white/70">{event.body}</p>}
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
        >
          Modifier
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-white/40 underline-offset-2 hover:text-rose-300 hover:underline disabled:opacity-50"
        >
          {isDeleting ? "…" : "Supprimer"}
        </button>
      </div>
    </li>
  );
}
