const NotFound = () => {
  const path = decodeURIComponent(window.location.pathname || "/");

  return (
    <section id="not-found" role="alert" aria-live="polite">
      <div id="window-header">
        <div id="window-controls" aria-hidden="true">
          <span className="close" />
          <span className="minimize" />
          <span className="maximize" />
        </div>
        <h2>404 - Not Found</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          sanaan.dev
        </span>
      </div>

      <div className="not-found-content">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We couldn&apos;t find <span className="font-semibold">{path}</span> on this
          Mac.
        </p>
        <h3>Looks like that folder doesn&apos;t exist.</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try heading back to the desktop to keep exploring.
        </p>
        <a href="/" className="not-found-button">
          Return to Home
        </a>
      </div>
    </section>
  );
};

export default NotFound;
