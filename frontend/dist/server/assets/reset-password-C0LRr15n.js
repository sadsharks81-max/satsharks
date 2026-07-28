import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { H as Header } from "./Header-BhkqVqMe.js";
import { F as Footer } from "./Footer-CN17TUqH.js";
import { I as Input } from "./Input-3QnCriAW.js";
import { B as Button } from "./Button-DE3Se9nv.js";
import "./Icon-Fsbc55mr.js";
import "./useAuth-CCZE-M2R.js";
import "./router-Be_1-VPB.js";
import "@tanstack/react-query";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    navigate({
      to: "/auth/login"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-background text-on-background animate-fade-up", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-extrabold tracking-[-0.02em]", children: "Set New Password" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-on-surface-variant", children: "Please enter your new password below" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsx(Input, { label: "New Password", type: "password", value: password, onChange: (e) => {
          setPassword(e.target.value);
          setError("");
        }, placeholder: "••••••••", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Confirm New Password", type: "password", value: confirmPassword, onChange: (e) => {
          setConfirmPassword(e.target.value);
          setError("");
        }, placeholder: "••••••••", error, required: true }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Update Password" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-sm text-on-surface-variant", children: /* @__PURE__ */ jsx(Link, { to: "/auth/login", className: "font-semibold text-primary hover:underline", children: "Return to login" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ResetPassword as component
};
