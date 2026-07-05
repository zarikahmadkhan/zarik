import Link from "next/link";

export default function PageStub({
  title,
  note,
  actionLabel,
  actionHref,
}: {
  title: string;
  note: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <section>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="card mt-4">
        <p className="text-sm text-fog-400">{note}</p>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="btn-primary mt-4">
            {actionLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
