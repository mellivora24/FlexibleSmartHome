import { NotificationRepository } from "@src/domain/repo/notificationRepo";

export class MarkAsRead {
    constructor(private notificationRepo: NotificationRepository) {}

    async execute(id: number, token: string) {
        return await this.notificationRepo.markAsRead(id, token);
    }
}
