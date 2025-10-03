import React, { useEffect, useRef, useContext } from 'react';
import { UploaderContext } from '@contexts/UploaderContext';
import useUpload from '@hooks/useUploader';
import { IMAGESTATUS } from '@app-types/image.interface';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic'];
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;
const MIN_SIZE = 10 * 1024; // 10KB


export default function Uploader({ setResults }: { setResults: (results: any) => void }): JSX.Element {
  const uploaderContext = useContext(UploaderContext);
  const dispatch = uploaderContext?.dispatch;
  const inputRef = useRef<HTMLInputElement>(null);
  // Set your endpoint or handler here
  const endpoint = '/secure/image/upload';
  const { upload, results, clear } = useUpload(endpoint);

  // Determine if any upload is in progress
  const isUploading = results && Object.values(results).some(r => r.status === IMAGESTATUS.PENDING);
  // Determine if all uploads are completed or failed
  const allDone = results && Object.values(results).length > 0 && Object.values(results).every(r => r.status !== IMAGESTATUS.PENDING);

  useEffect(() => {
    setResults(results);
    if (!results || !dispatch) return;
    const imageMap = new Map<string, boolean>();
    results && Object.values(results).forEach((r: any) => imageMap.set(r.name || r.filename || r.file.name, r));
    const finalSet = Array.from(imageMap.values())
    if (finalSet.length > 0) {
      // Map to UploadFile shape for context
      const filesToAdd = finalSet.map((r: any) => ({
        id: r.id || r.file?.id || r.file?.name,
        file: r.file,
        name: r.file?.name || r.filename,
        status: r.status,
        progress: r.progress,
        thumbUrl: r.thumbUrl,
        s3Url: r.s3Url,
        preview: r.preview,
        errorMessage: r.errorMessage,
        reason: r.reason,
      }));
      dispatch({ type: 'ADD_FILES', files: filesToAdd });
    }
  }, [results, dispatch, setResults]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      upload(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  let buttonTitle = 'Upload files';
  if (isUploading) buttonTitle = 'Uploading...';
  else if (allDone) buttonTitle = 'Upload more files';

  return (
    <div className="mb-3">
      <div
        className="border border-2 border-dashed rounded d-flex flex-column align-items-center justify-content-center py-4 mb-2"
        style={{ minHeight: 120, cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1 }}
        onClick={() => !isUploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-disabled={isUploading}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.heic"
          multiple
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={onInputChange}
          disabled={isUploading}
        />
        <button
          className="btn btn-outline-primary mb-2"
          type="button"
          onClick={(e) => { e.stopPropagation(); if (!isUploading) inputRef.current?.click(); }}
          disabled={isUploading}
        >
          {buttonTitle}
        </button>
        <div className="text-muted small text-center">Click to upload<br />PNG, JPG, HEIC up to 120MB</div>
      </div>
      <div className="text-muted small">It can take up to 1 minute to upload</div>
    </div>
  );
}
