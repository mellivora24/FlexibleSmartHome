export interface Notification {
    ID: number;
    UID: number;
    McuCode: number;
    Title: string;
    Message: string;
    IsRead: boolean;
    CreatedAt: string;
}

export interface NotificationListResponse {
    data: {
        total: number;
        list: Notification[];
    };
    success: boolean;
}

export interface NotificationParams {
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export class NotificationEntity {
    constructor(
        public id: number,
        public uid: number,
        public mcuCode: number,
        public title: string,
        public message: string,
        public isRead: boolean,
        public createdAt: Date
    ) { }

    static fromJSON(json: Notification): NotificationEntity {
        return new NotificationEntity(
            json.ID,
            json.UID,
            json.McuCode,
            json.Title,
            json.Message,
            json.IsRead,
            new Date(json.CreatedAt)
        );
    }

    toJSON(): Notification {
        return {
            ID: this.id,
            UID: this.uid,
            McuCode: this.mcuCode,
            Title: this.title,
            Message: this.message,
            IsRead: this.isRead,
            CreatedAt: this.createdAt.toISOString(),
        };
    }

    getRelativeTime(): string {
        const now = new Date();
        const diffMs = now.getTime() - this.createdAt.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return this.createdAt.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            year: this.createdAt.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    }
}
