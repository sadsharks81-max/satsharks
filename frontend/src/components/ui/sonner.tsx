import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "rounded-xl border border-outline-variant/40 shadow-lg font-body text-sm",
      }}
    />
  );
}
