import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'activity-jar-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((activityId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((activityId: string) => {
    return favorites.includes(activityId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};
