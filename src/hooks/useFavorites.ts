import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/data/activities';

const FAVORITES_KEY = 'activity-jar-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Activity[]>([]);

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

  const toggleFavorite = useCallback((activity: Activity) => {
    setFavorites(prev => {
      const exists = prev.some(a => a.id === activity.id);
      const newFavorites = exists
        ? prev.filter(a => a.id !== activity.id)
        : [...prev, activity];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((activityId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(a => a.id !== activityId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((activityId: string) => {
    return favorites.some(a => a.id === activityId);
  }, [favorites]);

  return { favorites, toggleFavorite, removeFavorite, isFavorite };
};
