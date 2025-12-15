import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid enum values for input validation
const VALID_AGE_GROUPS = ['2-4', '5-7', '8-10', '11-13'];
const VALID_LOCATIONS = ['indoor', 'outdoor', 'kitchen', 'travel'];
const VALID_DURATIONS = ['5min', '15min', '30min'];
const VALID_MATERIALS = ['none', 'household', 'craft'];
const MAX_RECENT_ACTIVITIES = 10;
const MAX_ACTIVITY_TITLE_LENGTH = 100;

// Input validation functions
function isValidString(value: unknown): value is string {
  return typeof value === 'string';
}

function isValidEnum(value: unknown, validValues: string[]): boolean {
  return isValidString(value) && validValues.includes(value);
}

function validateFilters(filters: unknown): { ageGroup?: string; location?: string; duration?: string; materials?: string } | null {
  if (!filters || typeof filters !== 'object') {
    return {};
  }
  
  const f = filters as Record<string, unknown>;
  const validated: { ageGroup?: string; location?: string; duration?: string; materials?: string } = {};
  
  if (f.ageGroup !== null && f.ageGroup !== undefined) {
    if (!isValidEnum(f.ageGroup, VALID_AGE_GROUPS)) {
      return null;
    }
    validated.ageGroup = f.ageGroup as string;
  }
  
  if (f.location !== null && f.location !== undefined) {
    if (!isValidEnum(f.location, VALID_LOCATIONS)) {
      return null;
    }
    validated.location = f.location as string;
  }
  
  if (f.duration !== null && f.duration !== undefined) {
    if (!isValidEnum(f.duration, VALID_DURATIONS)) {
      return null;
    }
    validated.duration = f.duration as string;
  }
  
  if (f.materials !== null && f.materials !== undefined) {
    if (!isValidEnum(f.materials, VALID_MATERIALS)) {
      return null;
    }
    validated.materials = f.materials as string;
  }
  
  return validated;
}

function validateRecentActivities(activities: unknown): string[] {
  if (!Array.isArray(activities)) {
    return [];
  }
  
  return activities
    .slice(0, MAX_RECENT_ACTIVITIES)
    .filter((item): item is string => isValidString(item))
    .map(item => item.slice(0, MAX_ACTIVITY_TITLE_LENGTH).replace(/[<>{}]/g, ''));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const filters = validateFilters(body.filters);
    if (filters === null) {
      console.log("Invalid filter values received");
      return new Response(JSON.stringify({ error: "Invalid filter values" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const recentActivities = validateRecentActivities(body.recentActivities);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from validated filters
    let filterContext = "";
    if (filters.ageGroup) filterContext += `Age group: ${filters.ageGroup} years old. `;
    if (filters.location) filterContext += `Location: ${filters.location}. `;
    if (filters.duration) filterContext += `Time available: ${filters.duration}. `;
    if (filters.materials) {
      const materialsMap: Record<string, string> = {
        'none': 'no supplies needed',
        'household': 'common household items',
        'craft': 'craft supplies'
      };
      filterContext += `Materials: ${materialsMap[filters.materials] || filters.materials}. `;
    }

    // Avoid recent activities (already sanitized)
    const recentContext = recentActivities.length > 0 
      ? `Avoid activities similar to: ${recentActivities.slice(0, 3).join(', ')}.` 
      : '';

    const systemPrompt = `You are a creative activity generator for the "Activity Jar" app. You create fun, actionable activities for kids that parents can do with them.

ALWAYS respond with a valid JSON object in this exact format:
{
  "title": "Short catchy title (3-5 words)",
  "description": "One or two sentences describing the activity with enthusiasm. Be specific and actionable!",
  "emoji": "A single relevant emoji",
  "duration": "5min" or "15min" or "30min",
  "materials": "none" or "household" or "craft"
}

Guidelines:
- Activities should be safe, educational, and FUN
- Be creative and unique - don't repeat common activities
- Match the activity to the filters provided
- Use engaging, playful language
- Keep descriptions under 150 characters`;

    const userPrompt = `Generate a unique, creative activity for kids.
${filterContext ? `Constraints: ${filterContext}` : 'No specific constraints.'}
${recentContext}

Remember: Respond ONLY with the JSON object, nothing else.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate activity");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    // Parse the JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse activity from response");
    }

    const activity = JSON.parse(jsonMatch[0]);
    
    // Generate a unique ID
    activity.id = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Ensure required fields have defaults
    activity.ageGroups = filters.ageGroup ? [filters.ageGroup] : ['2-4', '5-7', '8-10', '11-13'];
    activity.locations = filters.location ? [filters.location] : ['indoor'];

    return new Response(JSON.stringify({ activity }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating activity:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate activity";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
