import { A } from "@solidjs/router";

export default function NotFoundPage() {
  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="mt-4 text-xl text-gray-600">Страница не найдена</p>
      <p class="mt-2 text-gray-500">
        Извините, запрашиваемая страница не существует.
      </p>
      <A
        href="/"
        class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Вернуться на главную
      </A>
    </div>
  );
}
