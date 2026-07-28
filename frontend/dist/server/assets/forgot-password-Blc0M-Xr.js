import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { H as Header } from "./Header-BhkqVqMe.js";
import { F as Footer } from "./Footer-CN17TUqH.js";
import { I as Input } from "./Input-3QnCriAW.js";
import { B as Button } from "./Button-DE3Se9nv.js";
import "./Icon-Fsbc55mr.js";
import "./useAuth-CCZE-M2R.js";
import "./router-Be_1-VPB.js";
import "@tanstack/react-query";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-background text-on-background animate-fade-up", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-extrabold tracking-[-0.02em]", children: "Reset Password" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-on-surface-variant", children: "Enter your email to receive a reset link" })
      ] }),
      submitted ? /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[32px]", children: "mark_email_read" }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-on-surface", children: [
          "If an account exists for ",
          /* @__PURE__ */ jsx("strong", { children: email }),
          ", you will receive password reset instructions."
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/auth/login", className: "block w-full", children: /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full", children: "Return to Login" }) })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsx(Input, { label: "Email Address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Send Reset Link" })
      ] }),
      !submitted && /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-on-surface-variant", children: [
        "Remembered your password?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/auth/login", className: "font-semibold text-primary hover:underline", children: "Log in" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ForgotPassword as component
};
