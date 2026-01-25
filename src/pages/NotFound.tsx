import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Music, Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex flex-col items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[150px]" />
      
      {/* Animated Floating Musical Notes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] hidden md:block text-orange-500/20"
      >
        <Music size={48} />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -15, 15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 right-[15%] hidden md:block text-orange-500/20"
      >
        <Music size={64} />
      </motion.div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        {/* Large 404 Number with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="font-display text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-700 drop-shadow-2xl">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center -z-10 blur-3xl opacity-30 select-none">
            <span className="text-[120px] md:text-[200px] font-black text-orange-500">404</span>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3x md:text-4xl font-bold text-foreground">
            The beat dropped... and so did this page.
          </h2>
          <p className="text-lg text-muted-foreground mx-auto max-w-md">
            Looks like this frequency is out of range. Don't worry, even the best producers miss a note sometimes.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-2xl border border-border bg-card px-8 py-4 font-bold text-foreground transition-all hover:bg-secondary hover:border-orange-500/50"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:scale-105 active:scale-95"
          >
            <Home size={20} />
            Back to Home
          </button>
        </motion.div>

        {/* Quick Search Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Search size={16} />
          <span>Try searching for tracks on our <button onClick={() => navigate("/browse")} className="text-orange-500 font-bold hover:underline">browse</button> page.</span>
        </motion.div>
      </div>
      
      {/* Waveform-like bars at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 flex items-end gap-1 px-4 overflow-hidden opacity-10 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [`${Math.random() * 40 + 10}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 40 + 10}%`] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-1 bg-gradient-to-t from-orange-500 to-transparent rounded-t-full"
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;

