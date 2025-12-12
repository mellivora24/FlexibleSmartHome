import { GetListSensorRequest, SensorDataItem } from '@model/SensorData';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GetListSensorData } from '@domain/usecase/sensorData/getListSensorData';
import { getToken } from '@infra/storage/authStorage';
import { SensorDataRepositoryImpl } from '@src/domain/repo/sensorDataRepo';
import { GetByIDAndValue } from '@src/domain/usecase/sensorData/getByIdAndValue';
import { GetListSensorDataByDID } from '@src/domain/usecase/sensorData/getListSensorDataByDID';

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
    column: keyof SensorDataItem | null;
    direction: SortDirection;
}

const ITEMS_PER_PAGE = 10;
const sensorDataRepository = new SensorDataRepositoryImpl();
const getListSensorDataUseCase = new GetListSensorData(sensorDataRepository);
const getByIDAndValueUseCase = new GetByIDAndValue(sensorDataRepository);
const getListSensorDataByDIDUseCase = new GetListSensorDataByDID(sensorDataRepository);

export function useSensorViewModel() {
    const [sortState, setSortState] = useState<SortState>({
        column: null,
        direction: null,
    });
    const [data, setData] = useState<SensorDataItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState<GetListSensorRequest>({
        page: 1,
        limit: ITEMS_PER_PAGE,
        sortBy: 'createdAt',
        sortType: 'desc',
    });

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / ITEMS_PER_PAGE);
    }, [totalItems]);

    const paginatedData = useMemo(() => {
        return data;
    }, [data]);

    const fetchData = useCallback(async (params: GetListSensorRequest) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await getListSensorDataUseCase.execute(params, token);
            
            setData(response.list || []);
            setTotalItems(response.total || 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sensor data';
            setError(errorMessage);
            console.error('Error fetching sensor data:', err);
            
            setData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDataByDID = useCallback(async (did: number, limit: number = ITEMS_PER_PAGE) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await getListSensorDataByDIDUseCase.execute(did, limit, token);
            
            setData(response.list || []);
            setTotalItems(response.total || 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sensor data';
            setError(errorMessage);
            console.error('Error fetching sensor data by DID:', err);

            setData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDataByDIDAndValue = useCallback(async (did: number, value: number) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await getByIDAndValueUseCase.execute(did, value, token);
            
            setData(response.list || []);
            setTotalItems(response.total || 0);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sensor data';
            setError(errorMessage);
            console.error('Error fetching sensor data by DID and Value:', err);

            setData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(filters);
    }, [filters, fetchData]);

    const handleSort = useCallback((column: keyof SensorDataItem, direction: SortDirection) => {
        setSortState({ column, direction });

        let sortBy = column.toString();

        const columnMapping: Record<string, string> = {
            'sensorName': 'name',
            'createdAt': 'time',
            'value': 'value',
            'unit': 'unit',
            'did': 'did',
        };
        
        sortBy = columnMapping[column] || column.toString();
        
        setFilters(prev => ({
            ...prev,
            sortBy: direction ? sortBy : 'createdAt',
            sortType: direction || 'desc',
            page: 1,
        }));
        setCurrentPage(1);
    }, []);

    const handleSearch = useCallback((searchType: string, searchText: string) => {
        const searchParams: Partial<GetListSensorRequest> = {
            page: 1,
            name: undefined,
            value: undefined,
            did: undefined,
        };

        if (searchText.trim()) {
            if (searchType === 'all') {
                searchParams.name = searchText;
            } else if (searchType === 'name') {
                searchParams.name = searchText;
            } else if (searchType === 'value') {
                const numValue = parseFloat(searchText);
                if (!isNaN(numValue)) {
                    searchParams.value = numValue;
                }
            } else if (searchType === 'did') {
                const didValue = parseInt(searchText);
                if (!isNaN(didValue)) {
                    searchParams.did = didValue;
                }
            }
        }

        setFilters(prev => ({
            ...prev,
            ...searchParams,
        }));
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setFilters(prev => ({ ...prev, page }));
    }, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            const resetFilters: GetListSensorRequest = {
                page: 1,
                limit: ITEMS_PER_PAGE,
                sortBy: 'createdAt',
                sortType: 'desc',
            };
            await fetchData(resetFilters);
            setFilters(resetFilters);
            setSortState({ column: null, direction: null });
            setCurrentPage(1);
            setError(null);
        } catch (error) {
            console.error('Error refreshing data:', error);
            setError('Failed to refresh data');
        } finally {
            setRefreshing(false);
        }
    }, [fetchData]);

    const updateFilters = useCallback((newFilters: Partial<GetListSensorRequest>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        const resetFilters: GetListSensorRequest = {
            page: 1,
            limit: ITEMS_PER_PAGE,
            sortBy: 'createdAt',
            sortType: 'desc',
        };
        setFilters(resetFilters);
        setCurrentPage(1);
    }, []);

    const filterByDateRange = useCallback((startTime?: string, endTime?: string) => {
        setFilters(prev => ({
            ...prev,
            startTime,
            endTime,
            time: undefined,
            page: 1,
        }));
        setCurrentPage(1);
    }, []);

    return {
        sortState,
        paginatedData,
        currentPage,
        totalPages,
        totalItems,
        refreshing,
        loading,
        error,
        filters,
        handleSort,
        handleSearch,
        handlePageChange,
        handleRefresh,
        updateFilters,
        clearFilters,
        filterByDateRange,
        fetchData,
        fetchDataByDID,
        fetchDataByDIDAndValue,
    };
}
