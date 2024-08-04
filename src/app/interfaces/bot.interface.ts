interface User {
    id: string;
    name: string;
}

export interface BotStatus {
    status: 'connected' | 'disconnected';
    user: User;
}
