import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext } from "react";
const appCss = "/assets/styles-B7h3VJDu.css";
function reportAppError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    { boundary: "tanstack_root_error_component" },
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    }
  );
}
const API_BASE_URL = "".replace(/\/$/, "");
const getUrl = (url2) => url2.startsWith("http") ? url2 : `${API_BASE_URL}${url2}`;
const api = {
  async get(url2) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(getUrl(url2), { headers });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP error! status: ${res.status}` };
      }
      return data || { success: true };
    } catch (e) {
      console.error("API GET failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },
  async post(url2, data) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(getUrl(url2), {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      });
      const dataJson = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: dataJson?.error || `HTTP error! status: ${res.status}` };
      }
      return dataJson || { success: true };
    } catch (e) {
      console.error("API POST failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },
  async put(url2, data) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(getUrl(url2), {
        method: "PUT",
        headers,
        body: data ? JSON.stringify(data) : void 0
      });
      const dataJson = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: dataJson?.error || `HTTP error! status: ${res.status}` };
      }
      return dataJson || { success: true };
    } catch (e) {
      console.error("API PUT failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  },
  async delete(url2) {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(getUrl(url2), {
        method: "DELETE",
        headers
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return { success: false, error: data?.error || `HTTP error! status: ${res.status}` };
      }
      return data || { success: true };
    } catch (e) {
      console.error("API DELETE failed:", e);
      return { success: false, error: "Network error: Connection to server failed." };
    }
  }
};
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await api.get("/api/users/me");
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (e) {
          logout();
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);
  const login = async (email, password) => {
    setIsLoading(true);
    const res = await api.post("/api/auth/login", { email, password });
    if (res.success) {
      localStorage.setItem("accessToken", res.accessToken);
      setUser(res.user);
      setIsLoading(false);
      return null;
    }
    setIsLoading(false);
    return res.error || "Invalid email or password.";
  };
  const register = async (name, email, password, country) => {
    setIsLoading(true);
    const res = await api.post("/api/auth/register", { name, email, password: password || "password123", country });
    if (res.success) {
      localStorage.setItem("accessToken", res.accessToken);
      setUser(res.user);
      setIsLoading(false);
      return null;
    }
    setIsLoading(false);
    return res.error || "Unable to create this account.";
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, isLoading, login, register, logout }, children });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-on-background", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-on-surface-variant", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-on-surface-variant", children: "Something went wrong. Try refreshing." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-medium hover:bg-surface-container-low",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$r = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SAT Sharks — Achieve Your Dream SAT Score & College Admission" },
      {
        name: "description",
        content: "Personalized SAT preparation, expert college counseling, essay reviews, and proven strategies that give you the competitive edge."
      },
      { property: "og:title", content: "SAT Sharks — Achieve Your Dream SAT Score" },
      {
        property: "og:description",
        content: "Personalized SAT prep, college counseling, and essay reviews to secure top university admissions."
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "SAT Sharks" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$r.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$q = () => import("./success-stories-DzacUcu1.js");
const Route$q = createFileRoute("/success-stories")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./subscriptions-C1z_HwWB.js");
const Route$p = createFileRoute("/subscriptions")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./dashboard-DYtVNuWM.js");
const Route$o = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./contact-BShngj5D.js");
const Route$n = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const url = "/__l5e/assets-v1/aa6336f0-190e-4708-be88-5087c791b226/hero.png";
const heroAsset = {
  url
};
const $$splitComponentImporter$m = () => import("./index-BfsqKecS.js");
const Route$m = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "SAT Sharks — Achieve Your Dream SAT Score & College Admission"
    }, {
      name: "description",
      content: "Personalized SAT preparation, expert college counseling, essay reviews, and proven strategies."
    }, {
      property: "og:title",
      content: "SAT Sharks — Achieve Your Dream SAT Score"
    }, {
      property: "og:description",
      content: "Personalized SAT prep, college counseling, and essay reviews."
    }, {
      property: "og:image",
      content: heroAsset.url
    }, {
      property: "twitter:image",
      content: heroAsset.url
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./index-D1WYOfIq.js");
const Route$l = createFileRoute("/dashboard/")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./index-DO7HIeDE.js");
const Route$k = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./tests-w44em5ze.js");
const Route$j = createFileRoute("/dashboard/tests")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./sat-tests-DLqvfSdN.js");
const Route$i = createFileRoute("/dashboard/sat-tests")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./practice-Dl8wdeIX.js");
const Route$h = createFileRoute("/dashboard/practice")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./history-ClxHiQST.js");
const Route$g = createFileRoute("/dashboard/history")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./analytics-DFE0lptJ.js");
const Route$f = createFileRoute("/dashboard/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./reset-password-C0LRr15n.js");
const Route$e = createFileRoute("/auth/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./register-BmfFv9_X.js");
const Route$d = createFileRoute("/auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./login-BcuIKxvV.js");
const Route$c = createFileRoute("/auth/login")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./forgot-password-Blc0M-Xr.js");
const Route$b = createFileRoute("/auth/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./users-DlS0rMPn.js");
const Route$a = createFileRoute("/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./uploads-CF_0F_5o.js");
const Route$9 = createFileRoute("/admin/uploads")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./tests-Qq3f89ln.js");
const Route$8 = createFileRoute("/admin/tests")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./success-stories-sj-Ye-Kb.js");
const Route$7 = createFileRoute("/admin/success-stories")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./questions-CnBrV496.js");
const Route$6 = createFileRoute("/admin/questions")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./contact-requests-B1svPksD.js");
const Route$5 = createFileRoute("/admin/contact-requests")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./test-result._attemptId-ClUQqe0X.js");
const Route$4 = createFileRoute("/dashboard/test-result/$attemptId")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./take-test._attemptId-B-qlMXo8.js");
const Route$3 = createFileRoute("/dashboard/take-test/$attemptId")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./sat-runner._attemptId-dDOX4no5.js");
const Route$2 = createFileRoute("/dashboard/sat-runner/$attemptId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./sat-result._attemptId-CopTfZKD.js");
const Route$1 = createFileRoute("/dashboard/sat-result/$attemptId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./review-upload._uploadId-DVYptSMh.js");
const Route = createFileRoute("/admin/review-upload/$uploadId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SuccessStoriesRoute = Route$q.update({
  id: "/success-stories",
  path: "/success-stories",
  getParentRoute: () => Route$r
});
const SubscriptionsRoute = Route$p.update({
  id: "/subscriptions",
  path: "/subscriptions",
  getParentRoute: () => Route$r
});
const DashboardRoute = Route$o.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$r
});
const ContactRoute = Route$n.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$r
});
const IndexRoute = Route$m.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$r
});
const DashboardIndexRoute = Route$l.update({
  id: "/",
  path: "/",
  getParentRoute: () => DashboardRoute
});
const AdminIndexRoute = Route$k.update({
  id: "/admin/",
  path: "/admin/",
  getParentRoute: () => Route$r
});
const DashboardTestsRoute = Route$j.update({
  id: "/tests",
  path: "/tests",
  getParentRoute: () => DashboardRoute
});
const DashboardSatTestsRoute = Route$i.update({
  id: "/sat-tests",
  path: "/sat-tests",
  getParentRoute: () => DashboardRoute
});
const DashboardPracticeRoute = Route$h.update({
  id: "/practice",
  path: "/practice",
  getParentRoute: () => DashboardRoute
});
const DashboardHistoryRoute = Route$g.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => DashboardRoute
});
const DashboardAnalyticsRoute = Route$f.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => DashboardRoute
});
const AuthResetPasswordRoute = Route$e.update({
  id: "/auth/reset-password",
  path: "/auth/reset-password",
  getParentRoute: () => Route$r
});
const AuthRegisterRoute = Route$d.update({
  id: "/auth/register",
  path: "/auth/register",
  getParentRoute: () => Route$r
});
const AuthLoginRoute = Route$c.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$r
});
const AuthForgotPasswordRoute = Route$b.update({
  id: "/auth/forgot-password",
  path: "/auth/forgot-password",
  getParentRoute: () => Route$r
});
const AdminUsersRoute = Route$a.update({
  id: "/admin/users",
  path: "/admin/users",
  getParentRoute: () => Route$r
});
const AdminUploadsRoute = Route$9.update({
  id: "/admin/uploads",
  path: "/admin/uploads",
  getParentRoute: () => Route$r
});
const AdminTestsRoute = Route$8.update({
  id: "/admin/tests",
  path: "/admin/tests",
  getParentRoute: () => Route$r
});
const AdminSuccessStoriesRoute = Route$7.update({
  id: "/admin/success-stories",
  path: "/admin/success-stories",
  getParentRoute: () => Route$r
});
const AdminQuestionsRoute = Route$6.update({
  id: "/admin/questions",
  path: "/admin/questions",
  getParentRoute: () => Route$r
});
const AdminContactRequestsRoute = Route$5.update({
  id: "/admin/contact-requests",
  path: "/admin/contact-requests",
  getParentRoute: () => Route$r
});
const DashboardTestResultAttemptIdRoute = Route$4.update({
  id: "/test-result/$attemptId",
  path: "/test-result/$attemptId",
  getParentRoute: () => DashboardRoute
});
const DashboardTakeTestAttemptIdRoute = Route$3.update({
  id: "/take-test/$attemptId",
  path: "/take-test/$attemptId",
  getParentRoute: () => DashboardRoute
});
const DashboardSatRunnerAttemptIdRoute = Route$2.update({
  id: "/sat-runner/$attemptId",
  path: "/sat-runner/$attemptId",
  getParentRoute: () => DashboardRoute
});
const DashboardSatResultAttemptIdRoute = Route$1.update({
  id: "/sat-result/$attemptId",
  path: "/sat-result/$attemptId",
  getParentRoute: () => DashboardRoute
});
const AdminReviewUploadUploadIdRoute = Route.update({
  id: "/admin/review-upload/$uploadId",
  path: "/admin/review-upload/$uploadId",
  getParentRoute: () => Route$r
});
const DashboardRouteChildren = {
  DashboardAnalyticsRoute,
  DashboardHistoryRoute,
  DashboardPracticeRoute,
  DashboardSatTestsRoute,
  DashboardTestsRoute,
  DashboardIndexRoute,
  DashboardSatResultAttemptIdRoute,
  DashboardSatRunnerAttemptIdRoute,
  DashboardTakeTestAttemptIdRoute,
  DashboardTestResultAttemptIdRoute
};
const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  ContactRoute,
  DashboardRoute: DashboardRouteWithChildren,
  SubscriptionsRoute,
  SuccessStoriesRoute,
  AdminContactRequestsRoute,
  AdminQuestionsRoute,
  AdminSuccessStoriesRoute,
  AdminTestsRoute,
  AdminUploadsRoute,
  AdminUsersRoute,
  AuthForgotPasswordRoute,
  AuthLoginRoute,
  AuthRegisterRoute,
  AuthResetPasswordRoute,
  AdminIndexRoute,
  AdminReviewUploadUploadIdRoute
};
const routeTree = Route$r._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AuthContext as A,
  Route$4 as R,
  api as a,
  Route$3 as b,
  Route$2 as c,
  Route$1 as d,
  Route as e,
  router as r
};
