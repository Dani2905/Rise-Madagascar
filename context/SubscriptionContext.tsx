import React, { createContext, useCallback, useContext, useState } from 'react';
import SubscriptionModal from '../components/subscription/SubscriptionModal';

interface SubscriptionContextValue {
  openSubscription: () => void;
  closeSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openSubscription = useCallback(() => setIsOpen(true), []);
  const closeSubscription = useCallback(() => setIsOpen(false), []);
  return (
    <SubscriptionContext.Provider value={{ openSubscription, closeSubscription }}>
      {children}
      {isOpen && <SubscriptionModal onClose={closeSubscription} />}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
};
