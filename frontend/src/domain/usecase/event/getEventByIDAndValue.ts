import { GetListEventsResponse } from '@model/Event';
import { EventRepository } from '@src/domain/repo/eventRepo';

export class GetEventByIDAndValueUseCase {
    constructor(private eventRepo: EventRepository) {}

    async execute(did: number, action: string, token: string): Promise<GetListEventsResponse> {
        return await this.eventRepo.getEventByIDAndValue(did, action, token);
    }
}
