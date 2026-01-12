import { Routes, Route } from "react-router-dom";
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
import Upload from "../pages/Upload";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/beat/:id" element={<BeatDetail />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/charts" element={<Charts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/liked" element={<Liked />} />
      <Route path="/recent" element={<Recent />} />
      <Route path="/purchases" element={<Purchases />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};