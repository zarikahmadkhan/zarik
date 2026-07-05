import AppNav from "@/components/AppNav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-app px-4 pb-24 pt-6 md:pb-10">
        {children}
      </main>
    </div>
  );
}
