import { createRoot } from "react-dom/client";
import UploaderApp from "./uploader/UploaderApp";
import "./index.css";
import "./uploader.css";

createRoot(document.getElementById("uploader-root")).render(<UploaderApp />);
