import PageStub from "@/components/PageStub";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PageStub
      title="Dashboard"
      note="Your tonight action, week plan, follow-ups owed, and reps land in phase 3. Start by trying demo mode."
      actionLabel="Load demo data"
      actionHref="/demo"
    />
  );
}
