import { Heart, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Filters } from '@/data/activities';

interface HeaderProps {
  onOpenFilters: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  activeFiltersCount: number;
}

export const Header = ({
  onOpenFilters,
  onOpenFavorites,
  favoritesCount,
  activeFiltersCount,
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 py-3 bg-background/80 backdrop-blur-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🫙</span>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Activity Jar
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">
              Instant fun ideas
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={onOpenFilters}
            className="relative p-2.5 rounded-full bg-card shadow-soft hover:shadow-md transition-all"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onOpenFavorites}
            className="relative p-2.5 rounded-full bg-card shadow-soft hover:shadow-md transition-all"
            aria-label="Open favorites"
          >
            <Heart className="w-5 h-5 text-foreground" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
