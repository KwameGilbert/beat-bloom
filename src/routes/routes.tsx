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
import Upload from "../pages/producer/upload";
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
import OAuthCallback from "../pages/OAuthCallback";
import VerifyEmail from "../pages/VerifyEmail";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import ProducerOverview from "../pages/producer/overview";
import ProducerBeats from "../pages/producer/beats";
import ProducerSales from "../pages/producer/sales";
import ProducerPayouts from "../pages/producer/payouts";
import ProducerAnalytics from "../pages/producer/analytics";
import ProducerSettings from "../pages/producer/settings";

import { Layout } from "../components/layout/Layout";
import { ProducerLayout } from "../components/layout/ProducerLayout";
import { AuthLayout } from "../components/auth/AuthLayout";
import { ProtectedRoute, GuestRoute } from "../components/auth/ProtectedRoute";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Auth Routes - Only accessible when NOT logged in */}
      <Route element={<AuthLayout />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        {/* OAuth Callback - handles redirect from Google, etc. */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Email Verification */}
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Main App Routes */}
      <Route element={<Layout />}>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        <Route path="/beat/:id" element={<BeatDetail />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/producer/:id" element={<ProducerProfile />} />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/password"
          element={
            <ProtectedRoute>
              <PasswordSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/2fa"
          element={
            <ProtectedRoute>
              <TwoFactorAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/payouts"
          element={
            <ProtectedRoute requiredRole="producer">
              <PayoutMethods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/billing"
          element={
            <ProtectedRoute>
              <BillingHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked"
          element={
            <ProtectedRoute>
              <Liked />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recent"
          element={
            <ProtectedRoute>
              <Recent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist/:playlistId"
          element={
            <ProtectedRoute>
              <PlaylistDetail />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* Producer Routes - Uses dedicated ProducerLayout */}
      <Route element={<ProducerLayout />}>
        <Route
          path="/producer/upload"
          element={
            <ProtectedRoute requiredRole="producer">
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/dashboard"
          element={
            <ProtectedRoute requiredRole="producer">
              <ProducerOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/beats"
          element={
            <ProtectedRoute requiredRole="producer">
              <ProducerBeats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/sales"
          element={
            <ProtectedRoute requiredRole="producer">
              <ProducerSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/payouts"
          element={
            <ProtectedRoute requiredRole="producer">
              <ProducerPayouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/analytics"
          element={
            <ProtectedRoute requiredRole="producer">
              <ProducerAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/settings"
          element={
            <ProtectedRoute requiredRole="producer">
              <ProducerSettings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};