"use client";

import { useTransition } from "react";
import { toggleBucketItem, deleteBucketItem } from "@/app/bucket-actions";

export function BucketItemRow({
  id,
  text,
  done,
}: {
  id: string;
  text: string;
  done: boolean;
}) {
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  function handleToggle() {
    startToggle(async () => {
      const result = await toggleBucketItem(id, text, !done);
      if (result?.error) alert(result.error);
    });
  }

  function handleDelete() {
    if (!confirm(`Retirer "${text}" de la liste ?`)) return;
    startDelete(async () => {
      const result = await deleteBucketItem(id);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <li className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isToggling}
        aria-pressed={done}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition disabled:opacity-50 ${
          done ? "border-rose bg-rose text-white" : "border-line text-transparent"
        }`}
      >
        ✓
      </button>
      <span className={`flex-1 text-sm ${done ? "text-muted line-through" : "text-wine"}`}>
        {text}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-xs text-muted underline-offset-2 hover:text-rose-d hover:underline disabled:opacity-50"
      >
        {isDeleting ? "…" : "retirer"}
      </button>
    </li>
  );
}
