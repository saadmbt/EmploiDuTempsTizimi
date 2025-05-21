
import { useState, useEffect, useCallback } from 'react';
import { Session, Cell, Filter } from '../types';

// Mock data (will be replaced with API call)
const mockData: Session[] = [
  { id: '1', formateur: 'Prof. Smith', groupe: 'Group A', module: 'Mathematics', jour: 'lundi', creneau: 1, salle: 'Room 101' },
  { id: '2', formateur: 'Dr. Johnson', groupe: 'Group B', module: 'Physics', jour: 'mardi', creneau: 2, salle: 'Lab 202' },
  { id: '3', formateur: 'Mrs. Williams', groupe: 'Group C', module: 'Chemistry', jour: 'mercredi', creneau: 3, salle: 'Lab 303' },
  { id: '4', formateur: 'Mr. Brown', groupe: 'Group A', module: 'Computer Science', jour: 'jeudi', creneau: 4, salle: 'Room 404' },
  { id: '5', formateur: 'Prof. Davis', groupe: 'Group D', module: 'Biology', jour: 'vendredi', creneau: 1, salle: 'Lab 505' },
  { id: '6', formateur: 'Dr. Miller', groupe: 'Group B', module: 'Literature', jour: 'samedi', creneau: 2, salle: 'Room 606' }
];

export const useSchedule = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  
  // For unique filter values
  const [uniqueFormateurValues, setUniqueFormateurValues] = useState<string[]>([]);
  const [uniqueGroupeValues, setUniqueGroupeValues] = useState<string[]>([]);
  const [uniqueSalleValues, setUniqueSalleValues] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, replace this with an API call
      // const response = await fetch('/api/emploi');
      // const data = await response.json();
      // setSessions(data.Seances);
      
      // Using mock data for now
      setSessions(mockData);
      
      // Extract unique values for filters
      setUniqueFormateurValues([...new Set(mockData.map(s => s.formateur))]);
      setUniqueGroupeValues([...new Set(mockData.map(s => s.groupe))]);
      setUniqueSalleValues([...new Set(mockData.map(s => s.salle))]);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch schedule data');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSession = useCallback(async (sessionId: string, updates: Partial<Session>) => {
    try {
      // In a real app, we would call the API here
      // await fetch('/api/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id: sessionId, updates })
      // });
      
      // Update local state
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId ? { ...session, ...updates } : session
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating session:', err);
      return false;
    }
  }, []);

  const hasConflict = useCallback((session: Session, targetCell: Cell): Session | null => {
    return sessions.find(s => 
      s.id !== session.id && 
      s.jour === targetCell.day && 
      s.creneau === targetCell.slot && 
      (s.salle === session.salle || s.formateur === session.formateur || s.groupe === session.groupe)
    ) || null;
  }, [sessions]);

  const addFilter = useCallback((filter: Filter) => {
    setFilters(prev => [...prev.filter(f => f.type !== filter.type), filter]);
  }, []);

  const removeFilter = useCallback((type: Filter['type']) => {
    setFilters(prev => prev.filter(f => f.type !== type));
  }, []);

  const filteredSessions = useCallback(() => {
    return sessions.filter(session => {
      return filters.every(filter => {
        if (filter.value === '') return true;
        return session[filter.type] === filter.value;
      });
    });
  }, [sessions, filters]);

  return {
    sessions: filteredSessions(),
    loading,
    error,
    filters,
    addFilter,
    removeFilter,
    updateSession,
    hasConflict,
    fetchData,
    uniqueFormateurValues,
    uniqueGroupeValues,
    uniqueSalleValues
  };
};
