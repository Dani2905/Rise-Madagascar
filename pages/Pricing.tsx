import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

// Les anciens liens restent utilisables sans conserver une page de tarifs séparée.
const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { openSubscription } = useSubscription();
  useEffect(() => {
    navigate('/', { replace: true });
    openSubscription();
  }, [navigate, openSubscription]);
  return null;
};
export default Pricing;
