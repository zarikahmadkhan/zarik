import PageStub from "@/components/PageStub";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PageStub
      title="Settings"
      note="Export, import, reset, and delete your local data — plus the plain-English privacy note. Ships in phase 1."
      actionLabel="Back to dashboard"
      actionHref="/app"
    />
  );
}
