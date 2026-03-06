import { useState, useEffect, useCallback } from "react";
import { fetchNotes } from "../services/api";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotes(params);
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return { notes, loading, error, refetch: loadNotes };
}
