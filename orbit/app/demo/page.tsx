import Link from "next/link";

export const metadata = { title: "Demo" };

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-app px-4 py-12">
      <h1 className="text-3xl font-semibold">Demo mode</h1>
      <p className="mt-3 text-fog-400">
        Seeding sample data arrives in phase 1. For now, head straight into the
        app shell.
      </p>
      <Link href="/app" className="btn-primary mt-6">
        Open the app
      </Link>
    </main>
  );
}
