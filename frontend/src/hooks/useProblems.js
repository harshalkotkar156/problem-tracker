import { useState, useEffect, useCallback } from "react";
import { fetchProblems } from "../services/api";

export function useProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProblems = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProblems(params);
      setProblems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  return { problems, loading, error, refetch: loadProblems };
}
