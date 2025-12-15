import { motion } from 'framer-motion';
import { Heart, Clock, MapPin, Package, RefreshCw, Volume2 } from 'lucide-react';
import { Activity } from '@/data/activities';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNewActivity: () => void;
}

const locationLabels: Record<string, string> = {
  indoor: 'Indoor',
  outdoor: 'Outdoor',
  kitchen: 'Kitchen',
  travel: 'On the Go',
};

const durationLabels: Record<string, string> = {
  '5min': '5 min',
  '15min': '15 min',
  '30min': '30+ min',
};

const materialLabels: Record<string, string> = {
  none: 'No supplies',
  household: 'Household items',
  craft: 'Craft supplies',
};

export const ActivityCard = ({
  activity,
  isFavorite,
  onToggleFavorite,
  onNewActivity,
}: ActivityCardProps) => {
  const speakActivity = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${activity.title}. ${activity.description}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        {/* Emoji header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
          className="text-6xl sm:text-7xl mb-4 text-center"
        >
          {activity.emoji}
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3"
        >
          {activity.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-center mb-6 leading-relaxed"
        >
          {activity.description}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {locationLabels[activity.locations[0]]}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/30 text-accent-foreground text-sm font-medium">
            <Clock className="w-3.5 h-3.5" />
            {durationLabels[activity.duration]}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
            <Package className="w-3.5 h-3.5" />
            {materialLabels[activity.materials]}
          </span>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={onToggleFavorite}
            className={cn(
              "p-3 rounded-full transition-all duration-200",
              isFavorite
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-6 h-6", isFavorite && "fill-primary")} />
          </button>

          <button
            onClick={speakActivity}
            className="p-3 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-all duration-200"
            aria-label="Read aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          <button
            onClick={onNewActivity}
            className="flex items-center gap-2 px-6 py-3 rounded-full gradient-button text-primary-foreground font-semibold shadow-button hover:shadow-[0_8px_25px_-5px_hsl(15_80%_50%_/_0.5)] transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            New Idea
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
