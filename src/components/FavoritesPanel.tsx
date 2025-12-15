import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2 } from 'lucide-react';
import { activities, Activity } from '@/data/activities';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteIds: string[];
  onRemoveFavorite: (id: string) => void;
  onSelectActivity: (activity: Activity) => void;
}

export const FavoritesPanel = ({
  isOpen,
  onClose,
  favoriteIds,
  onRemoveFavorite,
  onSelectActivity,
}: FavoritesPanelProps) => {
  const favoriteActivities = activities.filter(a => favoriteIds.includes(a.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-card shadow-card overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <h2 className="text-xl font-bold text-foreground">Favorites</h2>
                <span className="text-sm text-muted-foreground">
                  ({favoriteActivities.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {favoriteActivities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground">
                    Tap the heart on any activity to save it here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-muted/50 rounded-2xl p-4 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        onSelectActivity(activity);
                        onClose();
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{activity.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavorite(activity.id);
                          }}
                          className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
                          aria-label="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
