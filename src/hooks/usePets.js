import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function usePets(userId) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch all pets for this user ──────────────────────
  const fetchPets = useCallback(async () => {
    if (!userId) { setPets([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (!error) setPets(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  // ── Add ───────────────────────────────────────────────
  const addPet = useCallback(async (pet) => {
    const { data, error } = await supabase
      .from("pets")
      .insert({ ...pet, user_id: userId })
      .select()
      .single();
    if (!error && data) setPets((prev) => [...prev, data]);
    return { data, error };
  }, [userId]);

  // ── Edit ──────────────────────────────────────────────
  const editPet = useCallback(async (updatedPet) => {
    const { id, user_id: _u, created_at: _c, ...fields } = updatedPet;
    const { error } = await supabase
      .from("pets")
      .update(fields)
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
    return { error };
  }, [userId]);

  // ── Delete ────────────────────────────────────────────
  const deletePet = useCallback(async (petId) => {
    const { error } = await supabase
      .from("pets")
      .delete()
      .eq("id", petId)
      .eq("user_id", userId);
    if (!error) setPets((prev) => prev.filter((p) => p.id !== petId));
    return { error };
  }, [userId]);

  return { pets, loading, addPet, editPet, deletePet, refetch: fetchPets };
}
