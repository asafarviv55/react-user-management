import { useState, useCallback } from 'react';

const useBulkOperations = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const toggleUserSelection = useCallback((userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, []);

  const toggleSelectAll = useCallback((allUserIds) => {
    if (isAllSelected) {
      setSelectedUsers([]);
      setIsAllSelected(false);
    } else {
      setSelectedUsers(allUserIds);
      setIsAllSelected(true);
    }
  }, [isAllSelected]);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
    setIsAllSelected(false);
  }, []);

  const isUserSelected = useCallback((userId) => {
    return selectedUsers.includes(userId);
  }, [selectedUsers]);

  const getSelectedCount = useCallback(() => {
    return selectedUsers.length;
  }, [selectedUsers]);

  return {
    selectedUsers,
    isAllSelected,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    isUserSelected,
    getSelectedCount
  };
};

export default useBulkOperations;
