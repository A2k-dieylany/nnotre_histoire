"use client";

import { useActionState, useState, useTransition } from "react";
import {
  deleteUnlockableContent,
  updateUnlockableContent,
  type AddSurpriseState,
} from "@/app/unlockable-actions";

type Item = {
  id: string;
  title: string;
  body: string | null;
  media_url: string | null;
  unlock_at: string;
  signedUrl: string | null;
};

export function UnlockableItem({ item }: { item: Item }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<AddSurpriseState, FormData>(
    updateUnlockableContent,
    null,
  );
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    if (!confirm(`Supprimer "${item.title}" ? C'est définitif.`)) return;
    startDelete(async () => {
      const result = await deleteUnlockableContent(item.id);
      if (result?.error) alert(result.error);
    });
  }

  if (editing) {
    return (
      <div className="border-t border-white/10 pt-6 first:border-none first:pt-0">
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={item.id} />
          <input
            type="text"
            name="title"
            defaultValue={item.title}
            required
            maxLength={120}
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:border-white/50 focus:outline-none"
          />
          <label className="text-xs text-white/50">
            Se déverrouille le
            <input
              type="date"
              name="unlock_at"
              defaultValue={item.unlock_at}
              required
              className="mt-1 block w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
            />
          </label>
          <textarea
            name="body"
            defaultValue={item.body ?? ""}
            rows={3}
            maxLength={2000}
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:border-white/50 focus:outline-none"
          />
          {item.media_url && (
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input type="checkbox" name="remove_media" />
              Supprimer l&apos;image actuelle
            </label>
          )}
          <input
            type="file"
            name="media"
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
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 pt-6 first:border-none first:pt-0">
      <h3 className="font-serif text-lg italic">{item.title}</h3>
      {item.signedUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- URL signée éphémère, next/image n'apporte rien ici
        <img
          src={item.signedUrl}
          alt=""
          loading="lazy"
          className="mt-3 max-h-72 w-full rounded-md object-cover"
        />
      )}
      {item.body && <p className="mt-2 text-sm text-white/70">{item.body}</p>}
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
    </div>
  );
}
