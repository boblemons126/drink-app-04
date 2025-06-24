import { useState, useEffect, createContext, useContext } from 'react';

interface SessionData {
  groupTotal: number;
  venuesVisited: number;
  squadSize: number;
  totalDrinks: number;
  sessionStartTime: Date | null;
}

interface SessionContextType {
  sessionData: SessionData;
  updateGroupTotal: (total: number) => void;
  updateVenuesVisited: (count: number) => void;
  updateSquadSize: (size: number) => void;
  updateTotalDrinks: (count: number) => void;
  startNewSession: () => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    groupTotal: 0,
    venuesVisited: 0,
    squadSize: 0,
    totalDrinks: 0,
    sessionStartTime: null
  });

  // Load session data from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setSessionData({
        ...parsed,
        sessionStartTime: parsed.sessionStartTime ? new Date(parsed.sessionStartTime) : null
      });
    }
  }, []);

  // Save session data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
  }, [sessionData]);

  const updateGroupTotal = (total: number) => {
    setSessionData(prev => ({ ...prev, groupTotal: total }));
  };

  const updateVenuesVisited = (count: number) => {
    setSessionData(prev => ({ ...prev, venuesVisited: count }));
  };

  const updateSquadSize = (size: number) => {
    setSessionData(prev => ({ ...prev, squadSize: size }));
  };

  const updateTotalDrinks = (count: number) => {
    setSessionData(prev => ({ ...prev, totalDrinks: count }));
  };

  const startNewSession = () => {
    setSessionData({
      groupTotal: 0,
      venuesVisited: 0,
      squadSize: 0,
      totalDrinks: 0,
      sessionStartTime: new Date()
    });
  };

  const resetSession = () => {
    setSessionData({
      groupTotal: 0,
      venuesVisited: 0,
      squadSize: 0,
      totalDrinks: 0,
      sessionStartTime: null
    });
    localStorage.removeItem('currentSession');
  };

  const value: SessionContextType = {
    sessionData,
    updateGroupTotal,
    updateVenuesVisited,
    updateSquadSize,
    updateTotalDrinks,
    startNewSession,
    resetSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}; 