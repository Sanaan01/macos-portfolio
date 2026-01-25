import { WindowControls } from "#components/index.js";

const NotFound = () => {
  const getSafePath = () => {
    const rawPath = window.location.pathname || "/";
    try {
      return decodeURIComponent(rawPath);
    } catch (e) {
      return rawPath;
    }
  };

  const path = getSafePath();

  return (
    <section id="not-found" className="flex flex-col" role="alert" aria-live="polite">
      <div id="window-header">
        <WindowControls target="notfound" />
        <h2>404 - Not Found</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 max-sm:hidden">
          sanaan.dev
        </span>
      </div>

      <div className="not-found-content flex-1 flex flex-col justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We couldn&apos;t find <span className="font-semibold text-gray-800 dark:text-white">{path}</span> on this
          Mac.
        </p>
        <h3>Looks like that folder doesn&apos;t exist.</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try heading back to the desktop to keep exploring.
        </p>
        <a href="/" className="not-found-button mt-4">
          Return to Home
        </a>
      </div>
    </section>
  );
};

export default NotFound;
