/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorBoundary, JSXElement, type Component } from "solid-js";
const MyErrorFallback: Component<{ children: JSXElement }> = (props) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>{props.children}</ErrorBoundary>
  );
};
export default MyErrorFallback;

function ErrorFallback(error: any, reset: () => void) {
  console.error(error);
  return (
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Ой! 😢</h1>
          <p class="py-6 text-xl text-error">Что-то пошло не так:</p>
          <div class="alert alert-error shadow-lg">
            <div>
              {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      // strokeLinecap="round"
                      // strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg> */}
              <span>{error.message}</span>
            </div>
          </div>
          <button onClick={reset} class="btn btn-primary mt-6">
            Попробовать снова
          </button>
        </div>
      </div>
    </div>
  );
}
