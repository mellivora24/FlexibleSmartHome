export interface EventModel {
    id: number;
    uid: number;
    did: number;
    deviceName: string;
    action: string;
    payload: any;
    createdAt: string;
}

export interface EventFilters {
    deviceName?: string;
    action?: string;
    startTime?: string;
    endTime?: string;
}

export interface EventSort {
    field: 'id' | 'deviceName' | 'action' | 'createdAt';
    direction: 'asc' | 'desc';
}

export interface GetListEventsRequest {
    did?: number;
    deviceName?: string;
    action?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
    startTime?: string;
    endTime?: string;
}

export interface GetListEventsResponse {
    total: number;
    list: EventModel[];
}

export interface GetOneEventRequest {
    id?: number;
    did?: number;
    action?: string;
    atTime?: string;
}
