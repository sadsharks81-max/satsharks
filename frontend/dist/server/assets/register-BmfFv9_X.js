import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { H as Header } from "./Header-BhkqVqMe.js";
import { F as Footer } from "./Footer-CN17TUqH.js";
import { I as Input } from "./Input-3QnCriAW.js";
import { B as Button } from "./Button-DE3Se9nv.js";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import "./Icon-Fsbc55mr.js";
import "./router-Be_1-VPB.js";
import "@tanstack/react-query";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [error, setError] = useState("");
  const {
    register
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (email && name && password && country) {
      const registerError = await register(name, email, password, country);
      if (registerError) {
        setError(registerError);
        return;
      }
      navigate({
        to: "/"
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-background text-on-background animate-fade-up", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex items-center justify-center p-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-extrabold tracking-[-0.02em]", children: "Create an Account" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-on-surface-variant", children: "Join SAT Sharks and boost your score" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsx(Input, { label: "Full Name", type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Jane Doe", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Email Address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Confirm Password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "••••••••", required: true }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant", children: "Country" }),
          /* @__PURE__ */ jsxs("select", { value: country, onChange: (e) => setCountry(e.target.value), className: "w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none", children: [
            /* @__PURE__ */ jsx("option", { value: "Pakistan", children: "Pakistan" }),
            /* @__PURE__ */ jsx("option", { value: "India", children: "India" }),
            /* @__PURE__ */ jsx("option", { value: "UAE", children: "UAE" }),
            /* @__PURE__ */ jsx("option", { value: "Saudi Arabia", children: "Saudi Arabia" }),
            /* @__PURE__ */ jsx("option", { value: "USA", children: "USA" }),
            /* @__PURE__ */ jsx("option", { value: "Canada", children: "Canada" }),
            /* @__PURE__ */ jsx("option", { value: "UK", children: "UK" }),
            /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
          ] })
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm font-medium text-error", children: error }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Create Account" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-on-surface-variant", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/auth/login", className: "font-semibold text-primary hover:underline", children: "Log in" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Register as component
};
