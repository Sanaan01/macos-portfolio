import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {WindowControls} from "#components/index.js";
import {Download} from "lucide-react";
import { Page, Document, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Resume = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="resume" />
        <h2>Resume.pdf</h2>

        <a
          href="/files/resume.pdf"
          download
          className="cursor-pointer"
          title="Download resume"
        >
          <Download className="icon"/>
        </a>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] h-[calc(100%-40px)] overflow-y-auto flex justify-center">
        <Document file="/files/resume.pdf">
          <Page
            pageNumber={1}
            renderTextLayer
            renderAnnotationLayer
            width={window.innerWidth < 640 ? window.innerWidth : undefined}
          />
        </Document>
      </div>
    </>

  )
}

const ResumeWindow = WindowWrapper(Resume, "resume")
export default ResumeWindow
