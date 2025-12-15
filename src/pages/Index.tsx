import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { BoredomButton } from '@/components/BoredomButton';
import { ActivityCard } from '@/components/ActivityCard';
import { FilterPanel } from '@/components/FilterPanel';
import { FavoritesPanel } from '@/components/FavoritesPanel';
import { useFavorites } from '@/hooks/useFavorites';
import { useAIActivity } from '@/hooks/useAIActivity';
import { Activity, Filters } from '@/data/activities';

const Index = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ageGroup: null,
    location: null,
    duration: null,
    materials: null,
  });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { generateActivity, isLoading } = useAIActivity();

  const activeFiltersCount = Object.values(filters).filter(v => v !== null).length;

  const getNewActivity = useCallback(async () => {
    const newActivity = await generateActivity(filters);
    if (newActivity) {
      setCurrentActivity(newActivity);
    }
  }, [filters, generateActivity]);

  const handleSelectActivity = (activity: Activity) => {
    setCurrentActivity(activity);
  };

  // Device shake detection for mobile
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = new Date().getTime();

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = new Date().getTime();
      const diffTime = currentTime - lastTime;

      if (diffTime > 100) {
        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > 2000 && !isLoading) {
          getNewActivity();
        }

        lastX = x;
        lastY = y;
        lastZ = z;
        lastTime = currentTime;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [getNewActivity, isLoading]);

  return (
    <div className="min-h-screen gradient-jar">
      <Header
        onOpenFilters={() => setShowFilters(true)}
        onOpenFavorites={() => setShowFavorites(true)}
        favoritesCount={favorites.length}
        activeFiltersCount={activeFiltersCount}
      />

      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-8">
        <AnimatePresence mode="wait">
          {currentActivity ? (
            <ActivityCard
              key={currentActivity.id}
              activity={currentActivity}
              isFavorite={isFavorite(currentActivity.id)}
              onToggleFavorite={() => toggleFavorite(currentActivity.id)}
              onNewActivity={getNewActivity}
              isLoading={isLoading}
            />
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Bored? Not anymore!
                </h2>
                <p className="text-muted-foreground">
                  AI creates unique activities just for you
                </p>
              </motion.div>

              {/* Boredom Button */}
              <BoredomButton onClick={getNewActivity} isShaking={isLoading} />

              {/* Hint text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground text-center"
              >
                📱 You can also shake your phone!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to button when viewing activity */}
        {currentActivity && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setCurrentActivity(null)}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to jar
          </motion.button>
        )}
      </main>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute top-40 right-8 text-3xl opacity-20"
          animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🎨
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-6 text-3xl opacity-20"
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          🎈
        </motion.div>
        <motion.div
          className="absolute bottom-24 right-12 text-4xl opacity-20"
          animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          ✨
        </motion.div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favoriteIds={favorites}
        onRemoveFavorite={toggleFavorite}
        onSelectActivity={handleSelectActivity}
      />
    </div>
  );
};

export default Index;
