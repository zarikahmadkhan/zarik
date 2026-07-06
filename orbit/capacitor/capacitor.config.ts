import type { CapacitorConfig } from "@capacitor/cli";

// Capacitor configuration for the future native wrapper.
//
// ⚠️ UNVERIFIED SCAFFOLD. This has NOT been built against Xcode or the
// Android SDK. It is structurally correct per Capacitor 6 conventions but
// must be validated on a Mac (iOS) / with Android Studio before any build
// or submission. See ./NATIVE_WRAPPER.md.
//
// To activate: move this file to the project root (orbit/capacitor.config.ts),
// install the Capacitor deps listed in NATIVE_WRAPPER.md, and follow the
// setup steps there. Kept in /capacitor so it does NOT affect the web build.

const config: CapacitorConfig = {
  appId: "app.orbit.social",
  appName: "Orbit",
  // Next.js must be exported statically for a Capacitor webDir.
  // See NATIVE_WRAPPER.md for the required next.config change.
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  backgroundColor: "#0e0f11",
};

export default config;
