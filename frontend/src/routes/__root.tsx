import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  ScrollRestoration,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import faviconUrl from "../assets/favicon.png?url";
import { reportAppError } from "../lib/error-reporting";
import { Toaster } from "../components/ui/sonner";
import { FloatingWhatsApp } from "../components/common/FloatingWhatsApp";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-on-background">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Something went wrong. Try refreshing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-medium hover:bg-surface-container-low"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SAT Sharks | Achieve Your Dream SAT Score & College Admission" },
      {
        name: "description",
        content:
          "Personalized SAT preparation, expert college counseling, essay reviews, and proven strategies that give you the competitive edge.",
      },
      { property: "og:title", content: "SAT Sharks | Achieve Your Dream SAT Score" },
      {
        property: "og:description",
        content:
          "Personalized SAT prep, college counseling, and essay reviews to secure top university admissions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "SAT Sharks" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "PK-PB" },
      { name: "geo.placename", content: "Lahore" },
      { name: "geo.position", content: "31.5204;74.3587" },
      { name: "ICBM", content: "31.5204, 74.3587" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: faviconUrl },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AuthProvider } from "../contexts/AuthContext";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hideWhatsApp = [
    "/dashboard/practice",
    "/dashboard/vocabulary",
    "/dashboard/sat-runner",
    "/classroom",
  ].some((path) => pathname.startsWith(path));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        {!hideWhatsApp && <FloatingWhatsApp />}
      </AuthProvider>
    </QueryClientProvider>
  );
}
