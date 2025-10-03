import { useState } from "react"
import "./SidePanel.component.scss"
import Uploader from "@components/Uploader";
import UploadProgressPanel from "@components/UploadProgressPanel";
import { IMAGESTATUS } from "@app-types/image.interface";

interface SidePanelProps { }


const SidePanel = (props: SidePanelProps): JSX.Element => {
  const [results, setResults] = useState<any>({});

  // Determine if any upload is still in progress
  const anyInProgress = results && Object.values(results).some((r: any) => r.status === IMAGESTATUS.PENDING);

  return (
    <div className="c-SidePanel bg-white my-4">
      <div className="shadow-md rounded p-4 mb-4">
        <h5 className="fw-bold mb-3">Upload photos</h5>
        <div className="mb-3 text-secondary small">
          Now the fun begins! Select at least <span className="fw-bold">6 of your best photos</span>.<br />
          Uploading a <span className="fw-bold">mix of close-ups, selfies and mid–range shots</span> can help the AI better capture your face and body type.
        </div>
        <Uploader setResults={setResults} />
      </div>
      {results && anyInProgress && (
        <div className="rounded p-4 shadow-md">
          <UploadProgressPanel results={results} />
        </div>
      )}
    </div>
  );
}

export default SidePanel
