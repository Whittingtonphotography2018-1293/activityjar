import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, MapPin, Clock, Package } from 'lucide-react';
import { Filters, AgeGroup, Location, Duration, Materials } from '@/data/activities';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: '2-4', label: '2-4 years' },
  { value: '5-7', label: '5-7 years' },
  { value: '8-10', label: '8-10 years' },
  { value: '11-13', label: '11-13 years' },
];

const locations: { value: Location; label: string; emoji: string }[] = [
  { value: 'indoor', label: 'Indoor', emoji: '🏠' },
  { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
  { value: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { value: 'travel', label: 'On the Go', emoji: '🚗' },
];

const durations: { value: Duration; label: string }[] = [
  { value: '5min', label: '5 min' },
  { value: '15min', label: '15 min' },
  { value: '30min', label: '30+ min' },
];

const materials: { value: Materials; label: string }[] = [
  { value: 'none', label: 'No supplies' },
  { value: 'household', label: 'Household items' },
  { value: 'craft', label: 'Craft supplies' },
];

export const FilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FilterPanelProps) => {
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({
      ...filters,
      [key]: filters[key] === value ? null : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ageGroup: null,
      location: null,
      duration: null,
      materials: null,
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== null);

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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-card max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-xl font-bold text-foreground">Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Filter sections */}
            <div className="px-6 pb-8 space-y-6">
              {/* Age Group */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Baby className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Age Group</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ageGroups.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateFilter('ageGroup', value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                        filters.ageGroup === value
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Location</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map(({ value, label, emoji }) => (
                    <button
                      key={value}
                      onClick={() => updateFilter('location', value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                        filters.location === value
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      <span className="text-lg">{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Time Available</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {durations.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateFilter('duration', value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                        filters.duration === value
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Materials Needed</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {materials.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateFilter('materials', value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                        filters.materials === value
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
