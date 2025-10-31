import { useCallback, useMemo, useState } from 'react';

import { SensorDataDB } from '@model/SensorData';
import { mockSensorData } from 'test/mockData';

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
    column: keyof SensorDataDB | null;
    direction: SortDirection;
}

const ITEMS_PER_PAGE = 10;

export function useSensorViewModel() {
    const [sortState, setSortState] = useState<SortState>({
        column: null,
        direction: null,
    });
    const [data, setData] = useState<SensorDataDB[]>(mockSensorData);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const totalPages = useMemo(
        () => Math.ceil(data.length / ITEMS_PER_PAGE),
        [data.length]
    );

    const paginatedData = useMemo(
        () => data.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        ),
        [data, currentPage]
    );

    const handleSort = useCallback((column: keyof SensorDataDB, direction: SortDirection) => {
        setSortState({ column, direction });

        if (!direction) {
            setData([...mockSensorData]);
            return;
        }

        const sortedData = [...data].sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (aValue instanceof Date && bValue instanceof Date) {
                return direction === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            return 0;
        });

        setData(sortedData);
        setCurrentPage(1);
    }, [data]);

    const handleSearch = useCallback((searchType: string, searchText: string) => {
        if (searchText.trim() === '') {
            setData([...mockSensorData]);
        } else {
            const filteredData = mockSensorData.filter((item) => {
                if (searchType === 'all') {
                    return (
                        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.value?.toString().toLowerCase().includes(searchText.toLowerCase())
                    );
                } else if (searchType === 'name') {
                    return item.name?.toLowerCase().includes(searchText.toLowerCase());
                } else if (searchType === 'value') {
                    return item.value?.toString().toLowerCase().includes(searchText.toLowerCase());
                }
                return false;
            });
            setData(filteredData);
        }
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setData([...mockSensorData]);
            setSortState({ column: null, direction: null });
            setCurrentPage(1);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    return {
        sortState,
        paginatedData,
        currentPage,
        totalPages,
        refreshing,
        handleSort,
        handleSearch,
        handlePageChange,
        handleRefresh,
    };
}
