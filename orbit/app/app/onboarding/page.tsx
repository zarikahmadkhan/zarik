import PageStub from "@/components/PageStub";

export const metadata = { title: "Onboarding" };

export default function OnboardingPage() {
  return (
    <PageStub
      title="Onboarding"
      note="A two-minute setup that generates your first 7-day plan. Ships in phase 3."
      actionLabel="Back to dashboard"
      actionHref="/app"
    />
  );
}
