import React from "react"
import "./UploadProgressPanel.component.scss"
import { IMAGESTATUS, UploadResults } from "@app-types/image.interface";

export interface UploadFileStatus {
  name: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number; // 0-100 for uploading
  errorMessage?: string;
}

interface UploadProgressPanelProps {
  results?: UploadResults;
}


const UploadProgressPanel = ({ results }: UploadProgressPanelProps): JSX.Element => {
  if (!results || !Object.keys(results).length) return <></>;
  return (
    <div className="c-UploadProgressPanel">
      <ul className="list-group list-group-flush">
        {Object.values(results).map((result, idx) => {
          const file = result.file
          return <li className="list-group-item px-0 py-3 d-flex align-items-center" key={file.name + idx}>
            <span className="me-2 text-truncate" style={{ maxWidth: 120 }}>{file.name}</span>
            <div className="flex-grow-1 mx-2">
              <div className="progress" style={{ height: 6 }}>
                <div
                  className={`progress-bar ${result.status === IMAGESTATUS.UPLOADED || result.status === IMAGESTATUS.ACCEPTED
                    ? 'bg-success' : result.status === 'FAILED' ? 'bg-danger' : ''}`}
                  role="progressbar"
                  style={{ width: `${result.progress}%` }}
                  aria-valuenow={result.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
            <span className="ms-auto d-flex align-items-center">
              {result.status === IMAGESTATUS.PENDING && (
                <span className="spinner-border spinner-border-sm text-primary" />
              )}
              {result.status === IMAGESTATUS.ACCEPTED || result.status === IMAGESTATUS.UPLOADED && (
                <span className="text-success" title="Uploaded">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M16 2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.01zM2 4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.01a2 2 0 0 1-2 2H2zm11.354-1.646a.5.5 0 0 0-.708 0L7.5 7.5 5.354 5.354a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l5-5a.5.5 0 0 0 0-.708z" /></svg>
                </span>
              )}
              {result.status === IMAGESTATUS.FAILED || result.status === IMAGESTATUS.REJECTED && (
                <span className="text-danger" title={result.error || 'Upload failed'}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.5 1.5 0 0 0-2.964 0l-6.857 12.5A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.339-2.434l-6.857-12.5zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1-2.002 0 1 1 0 0 1 2.002 0z" /></svg>
                </span>
              )}
            </span>
          </li>
        })}
      </ul>
    </div>
  );
}

export default UploadProgressPanel
