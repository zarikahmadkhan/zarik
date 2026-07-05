import PageStub from "@/components/PageStub";

export const metadata = { title: "Tonight" };

export default function TonightPage() {
  return (
    <PageStub
      title="Tonight"
      note="The Solo Night Generator — three plans for tonight based on your mood, energy, and budget. The generator engine arrives in phase 2."
      actionLabel="Back to dashboard"
      actionHref="/app"
    />
  );
}
