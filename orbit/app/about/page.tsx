import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-app px-4 py-12">
      <h1 className="text-3xl font-semibold">About Orbit</h1>
      <p className="mt-4 max-w-prose text-fog-400">
        Orbit is a private operating system for adults rebuilding social life.
        It is not a dating app, not a feed, and not therapy. It helps you pick
        something worth attending, go, talk to one person, follow up, and
        repeat.
      </p>
      <Link href="/" className="btn-secondary mt-6">
        Back home
      </Link>
    </main>
  );
}
