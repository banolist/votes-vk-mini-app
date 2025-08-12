interface SSEClientOptions<T> {
  url: string;
  headers?: Record<string, string>;
  onMessage: (event: T) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

interface SSEClient {
  close: () => void;
}

export function createSSEClient<T>(options: SSEClientOptions<T>): SSEClient {
  const controller = new AbortController();
  let buffer = "";

  async function start() {
    try {
      const response = await fetch(options.url, {
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          ...options.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          options.onComplete?.();
          return;
        }

        buffer += decoder.decode(value, { stream: true });

        // Обработка полных событий
        let eventEndIndex;
        while ((eventEndIndex = buffer.indexOf("\n\n")) >= 0) {
          const eventData = buffer.slice(0, eventEndIndex);
          buffer = buffer.slice(eventEndIndex + 2);

          processEvent(eventData);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        options.onError?.(error);
      }
    }
  }

  function processEvent(eventData: string) {
    const lines = eventData.split("\n");
    let data: string | null = null;

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        data = line.slice(6).trim();
      }
    }

    if (data) {
      try {
        const parsedData: T = JSON.parse(data);
        options.onMessage(parsedData);
      } catch (e) {
        options.onError?.(new Error("Failed to parse event data"));
      }
    }
  }

  function close() {
    controller.abort();
  }

  start();

  return { close };
}

// Пример использования
// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   createdAt: string;
// }

// const sseClient = createSSEClient<Notification>({
//   url: "https://api.example.com/notifications",
//   headers: {
//     Authorization: "Bearer YOUR_TOKEN",
//   },
//   onMessage: (notification) => {
//     console.log("New notification:", notification);
//     // Обновление UI
//   },
//   onError: (error) => {
//     console.error("SSE Error:", error);
//   },
//   onComplete: () => {
//     console.log("Connection closed");
//   },
// });

// Для остановки подписки
// sseClient.close();
