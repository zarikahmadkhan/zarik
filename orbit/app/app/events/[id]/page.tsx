import PageStub from "@/components/PageStub";

export const metadata = { title: "Event" };

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <PageStub
      title={`Event ${params.id}`}
      note="Event detail — arrival strategy, openers, exit rule, and reflections arrive in phase 4."
      actionLabel="All events"
      actionHref="/app/events"
    />
  );
}
