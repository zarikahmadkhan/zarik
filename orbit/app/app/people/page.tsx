import PageStub from "@/components/PageStub";

export const metadata = { title: "People" };

export default function PeoplePage() {
  return (
    <PageStub
      title="People"
      note="Your private relationship tracker. Add the people you meet so weak ties do not die. Ships in phase 5."
      actionLabel="Back to dashboard"
      actionHref="/app"
    />
  );
}
