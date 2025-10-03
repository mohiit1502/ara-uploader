
import "./Main.component.scss"
import { useContext } from "react";
import { UploaderContext } from "@contexts/UploaderContext";
import { IMAGESTATUS } from "@app-types/image.interface";

interface MainProps { }

const Main = (props: MainProps): JSX.Element => {
  const uploaderContext = useContext(UploaderContext);
  const files = uploaderContext?.files || [];
  const dispatch = uploaderContext?.dispatch;
  // Only show files with a valid thumbUrl and status 'COMPLETED'
  // Only show files with a valid thumbUrl and status 'COMPLETED', and filter out files that have been removed (by id)
  const MAX_PHOTOS = 10;
  const acceptedFiles = files.filter(
    (f, idx, arr) =>
      (f.status === IMAGESTATUS.UPLOADED || f.status === IMAGESTATUS.ACCEPTED) &&
      // Only include the first occurrence of each id
      arr.findIndex(ff => ff.id === f.id) === idx
  );
  const rejectedFiles = files.filter(
    (f, idx, arr) =>
      f.status === IMAGESTATUS.REJECTED &&
      // Only include the first occurrence of each id
      arr.findIndex(ff => ff.id === f.id) === idx
  );
  // Files that are currently uploading or processing
  const uploadingFiles = files.filter(f => f.status === IMAGESTATUS.PENDING || f.status === IMAGESTATUS.PROCESSING);

  if (acceptedFiles.length === 0 && uploadingFiles.length === 0) {
    return (
      <div className="h-100 my-4 d-flex align-items-center justify-content-center" style={{ minHeight: 500, background: '#f9fbfa', border: 'none' }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 420,
            width: '100%',
            background: 'linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)',
            boxShadow: '0 4px 32px 0 rgba(30, 60, 90, 0.10)',
            borderRadius: 20,
            padding: '48px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48" style={{ marginBottom: 16 }}>
            <rect width="48" height="48" rx="12" fill="#e3f0ff" />
            <path d="M24 14v14m0 0l-5-5m5 5l5-5" stroke="#1a8917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="32" r="1.5" fill="#1a8917" />
          </svg>
          <div className="text-center text-muted" style={{ fontSize: 20, fontWeight: 500, color: '#2d3748' }}>
            No photos uploaded yet.<br />
            <span style={{ fontWeight: 400, color: '#4a5568', fontSize: 16 }}>
              Start by uploading your first photo!
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show uploading shimmer boxes if any
  if (uploadingFiles.length > 0 && acceptedFiles.length === 0 && rejectedFiles.length === 0) {
    return (
      <div className="card p-4 h-100 my-4" style={{ background: '#f9fbfa', border: 'none', minHeight: 500 }}>
        <div className="mb-4" style={{ fontSize: 18, fontWeight: 500, color: '#2d3748' }}>Uploading Photos...</div>
        <div className="row g-3">
          {uploadingFiles.map((file, idx) => (
            <div className="col-6 col-md-4" key={file.id || idx}>
              <div className="position-relative rounded-3 overflow-hidden shimmer-loader" style={{ background: '#e3e8ee', aspectRatio: '1/1', minHeight: 120, maxHeight: 180, borderRadius: 12 }}>
                <div className="shimmer" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              </div>
              <div className="mt-2 text-center text-muted small">{file.name || 'Uploading...'}</div>
            </div>
          ))}
        </div>
        <style>{`
          .shimmer-loader {
            position: relative;
            overflow: hidden;
            background: #e3e8ee;
          }
          .shimmer::before {
            content: '';
            position: absolute;
            top: 0; left: -60%;
            width: 60%; height: 100%;
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
            animation: shimmer-move 1.2s infinite;
          }
          @keyframes shimmer-move {
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="card p-4 h-100 my-4" style={{ background: '#f9fbfa', border: 'none', minHeight: 500 }}>
      {/* Accepted Photos Section */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="fw-semibold" style={{ fontSize: 18 }}>Accepted Photos</div>
        <div className="text-muted" style={{ fontSize: 15 }}>
          <span className="fw-bold" style={{ color: '#1a8917' }}>{acceptedFiles.length}</span> <span className="mx-1">|</span> <span>{acceptedFiles.length} of {MAX_PHOTOS}</span>
        </div>
      </div>
      <div className="progress mb-4" style={{ height: 6, background: '#e9ecef' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${Math.min(acceptedFiles.length / 10 * 100, 100)}%`, background: '#1a8917' }}
          aria-valuenow={acceptedFiles.length}
          aria-valuemin={0}
          aria-valuemax={10}
        />
      </div>
      <div className="bg-white rounded-4 p-4 mb-4" style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.07)' }}>
        <div className="mb-3 text-muted" style={{ fontSize: 14, marginTop: -4 }}>
          These images passed our scoring test and will all be used to generate your AI photos.
        </div>
        <div className="row g-3">
          {acceptedFiles.map((file, idx) => (
            <div className="col-6 col-md-4">
              <div className="position-relative rounded-3 overflow-hidden shadow-sm" style={{ background: '#f3f3f3', aspectRatio: '1/1' }}>
                <img
                  src={file.thumbUrl || file.s3Url || file.preview}
                  alt={file.name || `Uploaded ${idx + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ borderRadius: 12, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 p-1 border shadow-sm"
                  style={{ borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Remove image"
                  onClick={() => {
                    dispatch && dispatch({ type: 'REMOVE_FILE', id: file.id });
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejected Photos Section */}
      <div className="bg-white rounded-4 p-4 mb-4" style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.07)' }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-semibold" style={{ fontSize: 17 }}>Some Photos Didn't Meet Our Guidelines</div>
        </div>
        <div className="mb-2 text-muted" style={{ fontSize: 14, marginTop: -4 }}>
          You can move to the next step once you've uploaded 7 good photos. Replacing these is optional.
        </div>
        <div className="row g-3">
          {/* Example rejected photos, replace with real data as needed */}
          {rejectedFiles.map((file, idx) => (
            <div className="col-12 col-md-4" key={idx}>
              <div className="position-relative rounded-3 overflow-hidden shadow-sm" style={{ background: '#f3f3f3', aspectRatio: '1/1' }}>
                <img
                  src={file.thumbUrl || file.s3Url || file.preview}
                  alt={file.name || `Uploaded ${idx + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ borderRadius: 12, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 p-1 border shadow-sm"
                  style={{ borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Remove image"
                  onClick={() => {
                    dispatch && dispatch({ type: 'REMOVE_FILE', id: file.id });
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-center text-danger fw-semibold" style={{ fontSize: 13 }}>{file.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main
