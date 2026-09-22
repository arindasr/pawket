import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { DEFAULT_ROUTINE } from "../utils/dateUtils";

export function useRoutines(userId, petIds, dateKey) {
  // routines: { [petId]: { meal_morning, meal_noon, ... } }
  const [routines, setRoutines] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRoutines = useCallback(async () => {
    if (!userId || !petIds.length || !dateKey) {
      setRoutines({});
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("daily_routines")
      .select("*")
      .eq("user_id", userId)
      .eq("date_key", dateKey)
      .in("pet_id", petIds);

    if (!error) {
      const map = {};
      // seed with defaults first
      petIds.forEach((id) => { map[id] = { ...DEFAULT_ROUTINE }; });
      // overwrite with fetched data
      (data ?? []).forEach((row) => {
        map[row.pet_id] = {
          meal_morning:      row.meal_morning,
          meal_noon:         row.meal_noon,
          meal_night:        row.meal_night,
          water_refill:      row.water_refill,
          activity_playtime: row.activity_playtime,
          activity_clean:    row.activity_clean,
        };
      });
      setRoutines(map);
    }
    setLoading(false);
  }, [userId, petIds.join(","), dateKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchRoutines(); }, [fetchRoutines]);

  // ── Upsert one pet's routine for the current dateKey ──
  const updateRoutine = useCallback(async (petId, routine) => {
    // Optimistic update
    setRoutines((prev) => ({ ...prev, [petId]: routine }));

    const { error } = await supabase
      .from("daily_routines")
      .upsert(
        {
          user_id:           userId,
          pet_id:            petId,
          date_key:          dateKey,
          ...routine,
        },
        { onConflict: "pet_id,date_key" }
      );

    if (error) {
      // Rollback on failure
      fetchRoutines();
    }
    return { error };
  }, [userId, dateKey, fetchRoutines]);

  return { routines, loading, updateRoutine, refetch: fetchRoutines };
}
