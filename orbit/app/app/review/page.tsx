import PageStub from "@/components/PageStub";

export const metadata = { title: "Weekly Review" };

export default function ReviewPage() {
  return (
    <PageStub
      title="Weekly Review"
      note="Generated from what you actually did this week — attended, skipped, met, followed up. Ships in phase 6."
      actionLabel="Back to dashboard"
      actionHref="/app"
    />
  );
}
