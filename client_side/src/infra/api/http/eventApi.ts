import { EventRepository } from '@domain/repo/eventRepo';
import { getToken } from '@infra/storage/authStorage';
import {
    EventModel,
    GetListEventsRequest,
    GetListEventsResponse,
    GetOneEventRequest,
} from '@model/Event';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

class EventApi implements EventRepository {
    private baseURL: string;

    constructor() {
        this.baseURL = `${API_CONFIG.BASE_URL}/core/events`;
    }

    private async getAuthHeaders() {
        const token = await getToken();
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    async getListEvents(params: GetListEventsRequest): Promise<GetListEventsResponse> {
        try {
            const headers = await this.getAuthHeaders();

            const queryParams: Record<string, any> = {};
            
            if (params.did) queryParams.did = params.did;
            if (params.deviceName) queryParams.device_name = params.deviceName;
            if (params.action) queryParams.action = params.action;
            if (params.page) queryParams.page = params.page;
            if (params.limit) queryParams.limit = params.limit;

            if (params.sortBy) {
                const sortByMapping: Record<string, string> = {
                    'id': 'id',
                    'deviceName': 'device_name',
                    'action': 'action',
                    'createdAt': 'created_at',
                };
                queryParams.sort_by = sortByMapping[params.sortBy] || 'created_at';
            } else {
                queryParams.sort_by = 'created_at';
            }

            if (params.sortType) {
                queryParams.sort_type = params.sortType;
            } else {
                queryParams.sort_type = 'desc';
            }

            const formatTime = (isoString: string): string => {
                const date = new Date(isoString);
                const pad = (n: number) => String(n).padStart(2, '0');
                
                const year = date.getFullYear();
                const month = pad(date.getMonth() + 1);
                const day = pad(date.getDate());
                const hours = pad(date.getHours());
                const minutes = pad(date.getMinutes());
                const seconds = pad(date.getSeconds());
                
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            if (params.startTime) {
                queryParams.start_time = formatTime(params.startTime);
            }
            if (params.endTime) {
                queryParams.end_time = formatTime(params.endTime);
            }

            const response = await axios.get(this.baseURL, {
                headers,
                params: queryParams,
            });

            if (response.data.success) {
                return {
                    total: response.data.data.total,
                    list: response.data.data.list,
                };
            } else {
                throw new Error(response.data.error || 'Failed to fetch events');
            }
        } catch (error: any) {
            console.error('Error fetching events:', error);
            throw new Error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch events'
            );
        }
    }

    async getEvent(params: GetOneEventRequest): Promise<EventModel> {
        try {
            const headers = await this.getAuthHeaders();

            const queryParams: Record<string, any> = {};
            if (params.did) queryParams.did = params.did;
            if (params.action) queryParams.action = params.action;
            if (params.atTime) {
                const date = new Date(params.atTime);
                const pad = (n: number) => String(n).padStart(2, '0');
                queryParams.at_time = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            }

            const url = params.id ? `${this.baseURL}/${params.id}` : this.baseURL;

            const response = await axios.get(url, {
                headers,
                params: queryParams,
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Failed to fetch event');
            }
        } catch (error: any) {
            console.error('Error fetching event:', error);
            throw new Error(
                error.response?.data?.error ||
                    error.message ||
                    'Failed to fetch event'
            );
        }
    }
}

export default new EventApi();
