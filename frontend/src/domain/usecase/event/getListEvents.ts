import { EventRepository } from '@src/domain/repo/eventRepo';
import { GetListEventsRequest, GetListEventsResponse } from '../../model/Event';

export class GetListEventsUseCase {
    constructor(private eventRepo: EventRepository) {}

    async execute(params: GetListEventsRequest): Promise<GetListEventsResponse> {
        return await this.eventRepo.getListEvents(params);
    }
}
