import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthBackground } from "./AuthBackground";

export const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end md:justify-center overflow-hidden bg-background">
      <AuthBackground />
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
};
