import { useState, useEffect, useCallback } from 'react';

const useUserSearch = (users, initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: initialFilters.status || 'all',
    role: initialFilters.role || 'all',
    sortBy: initialFilters.sortBy || 'name',
    sortOrder: initialFilters.sortOrder || 'asc'
  });
  const [filteredUsers, setFilteredUsers] = useState(users);

  const filterUsers = useCallback(() => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }

    // Role filter
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[filters.sortBy] || '';
      let bValue = b[filters.sortBy] || '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(result);
  }, [users, searchTerm, filters]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      role: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    filteredUsers
  };
};

export default useUserSearch;
