import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useNotes(userId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!userId) { setNotes([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setNotes(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // ── Add ───────────────────────────────────────────────
  const addNote = useCallback(async (note) => {
    const { data, error } = await supabase
      .from("notes")
      .insert({ ...note, user_id: userId })
      .select()
      .single();
    if (!error && data) setNotes((prev) => [data, ...prev]);
    return { data, error };
  }, [userId]);

  // ── Delete ────────────────────────────────────────────
  const deleteNote = useCallback(async (noteId) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", userId);
    if (!error) setNotes((prev) => prev.filter((n) => n.id !== noteId));
    return { error };
  }, [userId]);

  return { notes, loading, addNote, deleteNote, refetch: fetchNotes };
}
