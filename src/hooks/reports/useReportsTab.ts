
import { useState } from 'react';

export const useReportsTab = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [retryCount, setRetryCount] = useState(0);

  const handleRetryCountIncrement = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    retryCount,
    handleTabChange,
    handleRetryCountIncrement
  };
};

