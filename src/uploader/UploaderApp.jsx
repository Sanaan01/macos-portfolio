import { useCallback, useMemo, useRef, useState } from "react";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = (bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1);
  return `${value} ${units[index]}`;
};

const buildFileEntry = (file) => ({
  id: crypto.randomUUID(),
  file,
  status: "queued",
  message: "Ready to upload",
});

const UploaderApp = () => {
  const [endpoint, setEndpoint] = useState("/api/upload");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const queuedFiles = useMemo(
    () => files.filter((item) => item.status === "queued"),
    [files]
  );

  const updateFile = useCallback((id, updates) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const addFiles = useCallback((fileList) => {
    const nextFiles = Array.from(fileList)
      .filter((file) => file.size > 0)
      .map(buildFileEntry);

    if (!nextFiles.length) return;
    setFiles((prev) => [...prev, ...nextFiles]);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer?.files?.length) {
        addFiles(event.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handlePickFiles = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!endpoint) return;

    for (const item of queuedFiles) {
      updateFile(item.id, { status: "uploading", message: "Uploading..." });
      const formData = new FormData();
      formData.append("file", item.file);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed (${response.status})`);
        }

        updateFile(item.id, { status: "uploaded", message: "Uploaded" });
      } catch (error) {
        updateFile(item.id, {
          status: "failed",
          message: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }
  };

  const clearAll = () => setFiles([]);

  return (
    <div className="uploader-root">
      <div className="uploader-window">
        <div id="window-header">
          <div id="window-controls">
            <div className="close" />
            <div className="minimize" />
            <div className="maximize" />
          </div>
          <p className="font-medium text-gray-500 dark:text-white">R2 Uploader</p>
          <span className="text-xs text-gray-400">Drag & Drop</span>
        </div>

        <div className="uploader-body">
          <section className="uploader-panel">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Drop photos to upload
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Files are sent to your R2 upload endpoint with cache headers set by the Worker.
            </p>

            <div
              className={`uploader-dropzone ${isDragging ? "is-active" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onClick={handlePickFiles}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handlePickFiles();
                }
              }}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={(event) => {
                  if (event.target.files?.length) {
                    addFiles(event.target.files);
                    event.target.value = "";
                  }
                }}
              />
              <div className="text-center">
                <p className="text-base font-medium text-gray-700 dark:text-white">
                  {isDragging ? "Drop files here" : "Drag files here or click to browse"}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP up to 25 MB</p>
              </div>
            </div>

            <div className="uploader-actions">
              <div className="uploader-endpoint">
                <label className="text-xs uppercase text-gray-500">Upload endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(event) => setEndpoint(event.target.value)}
                  placeholder="/api/upload"
                />
              </div>
              <div className="uploader-buttons">
                <button className="btn btn-secondary" type="button" onClick={clearAll}>
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUpload}
                  disabled={!queuedFiles.length}
                >
                  Upload {queuedFiles.length ? `(${queuedFiles.length})` : ""}
                </button>
              </div>
            </div>
          </section>

          <section className="uploader-list">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Queue
              </h2>
              <span className="text-xs text-gray-400">{files.length} file(s)</span>
            </div>

            {files.length === 0 ? (
              <div className="uploader-empty">
                <p className="text-sm text-gray-400">No files added yet.</p>
              </div>
            ) : (
              <ul className="uploader-files">
                {files.map((item) => (
                  <li key={item.id} className="uploader-file">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatBytes(item.file.size)} · {item.message}
                      </p>
                    </div>
                    <span className={`status ${item.status}`}>{item.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UploaderApp;
