"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { deleteGalleryPhoto, updateGalleryCaption, type GalleryState } from "@/app/gallery-actions";

type Photo = {
  id: string;
  caption: string | null;
  taken_on: string | null;
  back_note: string | null;
  signedUrl: string | null;
};

const DOUBLE_TAP_MS = 300;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

export function GalleryPhoto({ photo }: { photo: Photo }) {
  const [editing, setEditing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [state, action, pending] = useActionState<GalleryState, FormData>(updateGalleryCaption, null);
  const [isDeleting, startDelete] = useTransition();
  const lastTap = useRef(0);

  function handleDelete() {
    if (!confirm("Supprimer cette photo ? C'est définitif.")) return;
    startDelete(async () => {
      const result = await deleteGalleryPhoto(photo.id);
      if (result?.error) alert(result.error);
    });
  }

  // EE.2 — double-tap/double-clic : onDoubleClick ne se déclenche pas de façon
  // fiable au toucher sur tous les navigateurs mobiles, d'où cette détection
  // manuelle par écart de temps entre deux taps, qui marche pour souris ET tactile.
  function handleTap() {
    if (!photo.back_note) return;
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      setFlipped((f) => !f);
    }
    lastTap.current = now;
  }

  return (
    <div className="mb-6 break-inside-avoid">
      <div className="[perspective:1000px]">
        <div
          onClick={handleTap}
          className={`relative [transform-style:preserve-3d] transition-transform duration-500 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          } ${photo.back_note ? "cursor-pointer" : ""}`}
        >
          {photo.signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- URL signée éphémère, next/image n'apporte rien ici
            <img
              src={photo.signedUrl}
              alt=""
              loading="lazy"
              className="w-full rounded-lg object-cover [backface-visibility:hidden]"
            />
          )}
          {photo.back_note && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#1a1214] p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="font-hand text-lg text-rose-100">{photo.back_note}</p>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <form action={action} className="mt-2 flex flex-col gap-2">
          <input type="hidden" name="id" value={photo.id} />
          <input
            type="text"
            name="caption"
            defaultValue={photo.caption ?? ""}
            maxLength={280}
            placeholder="Légende"
            className="rounded-md border border-white/20 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
          <input
            type="date"
            name="taken_on"
            defaultValue={photo.taken_on ?? ""}
            className="rounded-md border border-white/20 bg-transparent px-2 py-1.5 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
          />
          <input
            type="text"
            name="back_note"
            defaultValue={photo.back_note ?? ""}
            maxLength={280}
            placeholder="Message caché (double-tap pour révéler)"
            className="rounded-md border border-white/20 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
          {state?.error && <p className="text-xs text-rose-300">{state.error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md border border-white/30 px-3 py-1 text-xs text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {pending ? "…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-white/10 px-3 py-1 text-xs text-white/60 transition hover:bg-white/10"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-2">
          {photo.caption && <p className="font-hand text-lg text-white/80">{photo.caption}</p>}
          {photo.taken_on && <p className="text-[11px] text-white/40">{formatDate(photo.taken_on)}</p>}
          <div className="mt-1 flex gap-3">
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
      )}
    </div>
  );
}
