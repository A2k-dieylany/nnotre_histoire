"use client";

import { useActionState, useState } from "react";
import { addGalleryPhoto } from "@/app/gallery-actions";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export function AddGalleryPhotoForm() {
  const [state, action, pending] = useActionState(addGalleryPhoto, null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_PHOTO_BYTES) {
      setClientError("L'image est trop lourde (8 Mo max).");
      e.target.value = "";
    } else {
      setClientError(null);
    }
  }

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-3">
      <input
        type="file"
        name="photo"
        accept="image/*"
        required
        onChange={handlePhotoChange}
        className="text-xs text-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-white file:px-3 file:py-1.5 file:text-xs file:text-wine"
      />
      <input
        type="text"
        name="caption"
        placeholder="Légende (optionnelle)"
        maxLength={280}
        className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine placeholder:text-muted/60 focus:border-rose focus:outline-none"
      />
      <input
        type="date"
        name="taken_on"
        className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine [color-scheme:light] focus:border-rose focus:outline-none"
      />
      <input
        type="text"
        name="back_note"
        placeholder="Message caché (optionnel) — révélé par un double-tap sur la photo"
        maxLength={280}
        className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine placeholder:text-muted/60 focus:border-rose focus:outline-none"
      />
      {(clientError || state?.error) && (
        <p className="text-sm text-rose-d">{clientError ?? state?.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-rose px-4 py-2 text-xs font-semibold tracking-wide text-white transition active:scale-95 hover:bg-rose-d disabled:opacity-50"
      >
        {pending ? "…" : "Ajouter à la galerie"}
      </button>
    </form>
  );
}
