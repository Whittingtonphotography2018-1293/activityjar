import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BoredomButtonProps {
  onClick: () => void;
  isShaking: boolean;
}

export const BoredomButton = ({ onClick, isShaking }: BoredomButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isShaking ? { rotate: [-3, 3, -3, 3, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500" />
      
      {/* Main button */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full gradient-button shadow-button flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_12px_40px_-8px_hsl(15_80%_50%_/_0.5)]">
        {/* Inner content */}
        <div className="flex flex-col items-center gap-2 text-primary-foreground">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
          <span className="text-xl sm:text-2xl font-bold tracking-wide">Shake!</span>
          <span className="text-sm opacity-90">for a fun idea</span>
        </div>
        
        {/* Decorative sparkles */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-secondary"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute top-4 -left-4 w-2 h-2 rounded-full bg-accent"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        />
      </div>
    </motion.button>
  );
};
