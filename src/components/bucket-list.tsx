import { createClient } from "@/lib/supabase/server";
import { BucketItemRow } from "./bucket-item-row";
import { AddBucketItemForm } from "./add-bucket-item-form";

export async function BucketList() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("bucket_items")
    .select("id, text, done")
    .order("created_at", { ascending: true });

  const pending = (items ?? []).filter((i) => !i.done);
  const done = (items ?? []).filter((i) => i.done);

  return (
    <section className="flex min-h-screen flex-col items-center gap-8 bg-black px-6 py-24 text-white">
      <h2 className="font-serif text-2xl italic">À faire ensemble</h2>

      {error && (
        <p className="text-sm text-rose-300">
          La liste n&apos;a pas pu être chargée (la migration-005 a-t-elle été exécutée ?).
        </p>
      )}

      {!error && items && items.length === 0 && (
        <p className="max-w-sm text-center text-sm text-white/50">
          Rien pour l&apos;instant. Ajoute la première idée en dessous.
        </p>
      )}

      {!error && (pending.length > 0 || done.length > 0) && (
        <ul className="flex w-full max-w-md flex-col gap-3">
          {pending.map((item) => (
            <BucketItemRow key={item.id} id={item.id} text={item.text} done={item.done} />
          ))}
          {done.map((item) => (
            <BucketItemRow key={item.id} id={item.id} text={item.text} done={item.done} />
          ))}
        </ul>
      )}

      <AddBucketItemForm />
    </section>
  );
}
