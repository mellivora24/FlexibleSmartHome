import { EventModel, GetOneEventRequest } from '@model/Event';
import { EventRepository } from '@src/domain/repo/eventRepo';

export class GetEventUseCase {
    constructor(private eventRepo: EventRepository) {}

    async execute(params: GetOneEventRequest): Promise<EventModel> {
        return await this.eventRepo.getEvent(params);
    }
}
