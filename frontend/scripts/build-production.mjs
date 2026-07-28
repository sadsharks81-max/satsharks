// Vite decides whether to emit jsxDEV while it is being imported. Set NODE_ENV
// before loading Vite so a hosting-provider environment variable cannot make a
// production build use React's development JSX transform.
process.env.NODE_ENV = "production";

const { build } = await import("vite");

await build({ mode: "production" });
