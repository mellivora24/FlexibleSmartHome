import { EventModel, GetListEventsRequest, GetListEventsResponse, GetOneEventRequest } from '@model/Event';

export interface EventRepository {
    getListEvents(params: GetListEventsRequest): Promise<GetListEventsResponse>;
    getEvent(params: GetOneEventRequest): Promise<EventModel>;
}
