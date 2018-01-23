export as namespace signalR;

export class HubConnection {
    constructor(name: string);
    on(name: string, callback: (...args: any[]) => void): void;
    invoke(name: string, ...args: any[]): void;
    start(): Promise<any>;
}

