import PageStub from "@/components/PageStub";

export const metadata = { title: "Person" };

export default function PersonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <PageStub
      title={`Person ${params.id}`}
      note="Person detail — follow-up drafts, reality checks, and handoff buttons arrive in phase 5."
      actionLabel="All people"
      actionHref="/app/people"
    />
  );
}
