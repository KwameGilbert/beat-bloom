import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import BeatDetail from "../pages/BeatDetail";
import Browse from "../pages/Browse";
import Charts from "../pages/Charts";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import Liked from "../pages/Liked";
import Recent from "../pages/Recent";
import Purchases from "../pages/Purchases";
import PlaylistDetail from "../pages/PlaylistDetail";
import Upload from "../pages/Upload";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Welcome from "../pages/Welcome";
import EditProfile from "../pages/EditProfile";
import Settings from "../pages/Settings";
import PasswordSettings from "../pages/PasswordSettings";
import TwoFactorAuth from "../pages/TwoFactorAuth";
import PayoutMethods from "../pages/PayoutMethods";
import BillingHistory from "../pages/BillingHistory";
import ProducerProfile from "../pages/ProducerProfile";

import { Layout } from "../components/layout/Layout";
import { AuthLayout } from "../components/auth/AuthLayout";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      
      <Route element={
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <Layout />
          </motion.div>
        </AnimatePresence>
      }>
            <Route path="/home" element={<Index />} />
            {/* ... other routes ... */}
            <Route path="/beat/:id" element={<BeatDetail />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/producer/:id" element={<ProducerProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/password" element={<PasswordSettings />} />
            <Route path="/settings/2fa" element={<TwoFactorAuth />} />
            <Route path="/settings/payouts" element={<PayoutMethods />} />
            <Route path="/settings/billing" element={<BillingHistory />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/upload" element={<Upload />} />
          </Route>

          <Route path="*" element={<NotFound />} />
    </Routes>
  );
};