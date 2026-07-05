import PageStub from "@/components/PageStub";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <PageStub
      title="Events"
      note="Add your first event once the event system lands in phase 4. Scoring weights recurring events heavily — repeated exposure is how relationships actually form."
      actionLabel="Back to dashboard"
      actionHref="/app"
    />
  );
}
