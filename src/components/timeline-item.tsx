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
  secret_note: string | null;
};

export function TimelineItem({ event }: { event: Event }) {
  const [editing, setEditing] = useState(false);
  const [revealed, setRevealed] = useState(false);
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
        <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-rose" />
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={event.id} />
          <input
            type="text"
            name="title"
            defaultValue={event.title}
            required
            maxLength={120}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine focus:border-rose focus:outline-none"
          />
          <input
            type="date"
            name="event_date"
            defaultValue={event.event_date}
            required
            className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine [color-scheme:light] focus:border-rose focus:outline-none"
          />
          <textarea
            name="body"
            defaultValue={event.body ?? ""}
            rows={3}
            maxLength={2000}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine focus:border-rose focus:outline-none"
          />
          <textarea
            name="secret_note"
            defaultValue={event.secret_note ?? ""}
            placeholder="Anecdote cachée (optionnelle) — révélée par un ✨ cliquable"
            rows={2}
            maxLength={1000}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine placeholder:text-muted/60 focus:border-rose focus:outline-none"
          />
          {event.cover_image_url && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" name="remove_cover" />
              Supprimer la photo actuelle
            </label>
          )}
          <input
            type="file"
            name="cover"
            accept="image/*"
            className="text-xs text-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-white file:px-3 file:py-1.5 file:text-xs file:text-wine"
          />
          {state?.error && <p className="text-sm text-rose-d">{state.error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-rose px-4 py-2 text-xs font-semibold tracking-wide text-white transition active:scale-95 hover:bg-rose-d disabled:opacity-50"
            >
              {pending ? "…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-line px-4 py-2 text-xs tracking-wide text-muted transition hover:bg-cream-2"
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
      <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-rose" />
      <time className="text-xs font-semibold uppercase tracking-widest text-rose">
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
      {event.body && <p className="mt-1 text-sm text-wine/80">{event.body}</p>}

      {event.secret_note && (
        <div className="mt-2">
          {revealed ? (
            <p className="font-hand text-lg text-rose-d">{event.secret_note}</p>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              aria-label="Révéler l'anecdote cachée"
              className="text-lg opacity-60 transition hover:opacity-100"
            >
              ✨
            </button>
          )}
        </div>
      )}

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-muted underline-offset-2 hover:text-rose-d hover:underline"
        >
          Modifier
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-muted underline-offset-2 hover:text-rose-d hover:underline disabled:opacity-50"
        >
          {isDeleting ? "…" : "Supprimer"}
        </button>
      </div>
    </li>
  );
}
