/* eslint-disable @typescript-eslint/no-explicit-any */

export class NotificationClient<T> {
  ws: WebSocket;
  subscriptionId: string | null;
  headers: Record<string, string>;
  listeners: ((event: T) => void)[];
  constructor(url: string, headers: Record<string, string>) {
    this.ws = new WebSocket(url, "graphql-ws");
    this.subscriptionId = null;
    this.listeners = [];
    this.headers = headers;

    this.ws.onmessage = (event) => this.handleMessage(event);
    this.ws.onerror = (error) => this.handleError(error);
    this.ws.onclose = () => this.handleClose();

    this.initializeConnection();
  }

  initializeConnection() {
    this.ws.onopen = () => {
      // Отправляем сообщение инициализации
      this.ws.send(
        JSON.stringify({
          type: "connection_init",
          payload: this.headers,
        })
      );

      // Подписываемся на уведомления
      this.subscriptionId = crypto.randomUUID();
      this.ws.send(
        JSON.stringify({
          id: this.subscriptionId,
          type: "start",
          payload: {
            query: `
              subscription NotificationAdded {
                notificationAdded {
                  id
                  title
                  message
                  createdAt
                }
              }
            `,
          },
        })
      );
    };
  }

  handleMessage(event: MessageEvent<any>) {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "connection_ack":
        console.log("Connected to server");
        break;

      case "data":
        if (data.id === this.subscriptionId) {
          const notification: T = data.payload.data.notificationAdded;
          this.listeners.forEach((cb) => cb(notification));
        }
        break;

      case "error":
        console.error("Subscription error:", data.payload);
        break;
    }
  }

  handleError(error: Event) {
    console.error("WebSocket error:", error);
  }

  handleClose() {
    console.log("Connection closed");
    // Можно добавить логику переподключения
  }

  subscribe(callback: (event: T) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  disconnect() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }
}
