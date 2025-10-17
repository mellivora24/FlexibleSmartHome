import { NotificationRepository } from "@src/domain/repo/notificationRepo";

export class GetNotifications {
    constructor(private notificationRepo: NotificationRepository) {}

    async execute(token: string) {
        return await this.notificationRepo.getNotifications(token);
    }
}
