import { useContext } from "react";
import { A as AuthContext } from "./router-Be_1-VPB.js";
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export {
  useAuth as u
};
