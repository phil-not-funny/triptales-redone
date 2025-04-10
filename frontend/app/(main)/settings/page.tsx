import Authenticated from "@/components/auth/Authenticated";

export default function SettingsPage() {
  return (
    <Authenticated>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-4">Settings page content goes here.</p>
      </div>
    </Authenticated>
  );
}
