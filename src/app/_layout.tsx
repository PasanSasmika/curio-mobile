// TypeScript does not resolve CSS side-effect imports without a declaration.
// @ts-expect-error The bundler handles this stylesheet import at runtime.
import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
