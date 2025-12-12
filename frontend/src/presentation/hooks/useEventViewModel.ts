import { EventFilters, EventModel, EventSort, GetListEventsRequest } from '@domain/model/Event';
import { GetEventUseCase } from '@domain/usecase/event/getEvent';
import { GetEventByIDAndValueUseCase } from '@domain/usecase/event/getEventByIDAndValue';
import { GetListEventsUseCase } from '@domain/usecase/event/getListEvents';
import eventApi from '@infra/api/http/eventApi';
import { useCallback, useEffect, useState } from 'react';

const getListEventsUseCase = new GetListEventsUseCase(eventApi);
const getEventUseCase = new GetEventUseCase(eventApi);
const getEventByIDAndValueUseCase = new GetEventByIDAndValueUseCase(eventApi);

export const useEventViewModel = () => {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    
    const [filters, setFilters] = useState<EventFilters>({
        deviceName: '',
        action: '',
        startTime: '',
        endTime: '',
    });
    
    const [sort, setSort] = useState<EventSort>({
        field: 'createdAt',
        direction: 'desc',
    });

    const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params: GetListEventsRequest = {
                page: currentPage,
                limit: itemsPerPage,
                sortBy: sort.field,
                sortType: sort.direction,
            };

            if (filters.deviceName) params.deviceName = filters.deviceName;
            if (filters.action) params.action = filters.action;
            if (filters.startTime) params.startTime = filters.startTime;
            if (filters.endTime) params.endTime = filters.endTime;

            const response = await getListEventsUseCase.execute(params);
            
            setEvents(response.list || []);
            setTotalItems(response.total || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events');
            setEvents([]);
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, filters, sort]);

    const fetchEventById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        
        try {
            const event = await getEventUseCase.execute({ id });
            setSelectedEvent(event);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch event');
            console.error('Error fetching event:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEventByIdAndAction = useCallback(async (did: number, action: string, token: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getEventByIDAndValueUseCase.execute(did, action, token);
            setEvents(response.list || []);
            setTotalItems(response.total || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events by ID and action');
            console.error('Error fetching events by ID and action:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(() => {
        fetchEvents();
    }, [fetchEvents]);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const changeItemsPerPage = useCallback((limit: number) => {
        setItemsPerPage(limit);
        setCurrentPage(1);
    }, []);

    const updateFilters = useCallback((newFilters: Partial<EventFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            deviceName: '',
            action: '',
            startTime: '',
            endTime: '',
        });
        setCurrentPage(1);
    }, []);

    const updateSort = useCallback((field: EventSort['field']) => {
        setSort(prev => {
            if (prev.field === field) {
                return {
                    field,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return {
                field,
                direction: 'asc',
            };
        });
        setCurrentPage(1);
    }, []);

    const search = useCallback((query: string, searchField: 'deviceName' | 'action') => {
        updateFilters({ [searchField]: query });
    }, [updateFilters]);

    const filterByTimeRange = useCallback((startTime: string, endTime: string) => {
        updateFilters({ startTime, endTime });
    }, [updateFilters]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
        events,
        loading,
        error,
        selectedEvent,
        currentPage,
        totalItems,
        itemsPerPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        filters,
        sort,
        refresh,
        goToPage,
        changeItemsPerPage,
        updateFilters,
        clearFilters,
        updateSort,
        search,
        filterByTimeRange,
        fetchEventById,
        setSelectedEvent,
        fetchEventByIdAndAction,
    };
};
