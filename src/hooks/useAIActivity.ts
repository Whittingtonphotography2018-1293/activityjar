import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Filters } from '@/data/activities';
import { toast } from 'sonner';

export const useAIActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recentTitles, setRecentTitles] = useState<string[]>([]);

  const generateActivity = useCallback(async (filters: Filters): Promise<Activity | null> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-activity', {
        body: { 
          filters,
          recentActivities: recentTitles 
        }
      });

      if (error) {
        console.error('Error calling generate-activity:', error);
        
        if (error.message?.includes('429')) {
          toast.error('Too many requests. Please wait a moment.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted.');
        } else {
          toast.error('Could not generate activity. Please try again.');
        }
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      const activity = data?.activity as Activity;
      
      if (activity) {
        // Track recent titles to avoid repetition
        setRecentTitles(prev => [activity.title, ...prev].slice(0, 5));
      }

      return activity;
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [recentTitles]);

  return { generateActivity, isLoading };
};
