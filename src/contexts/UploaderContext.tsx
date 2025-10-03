import { IMAGESTATUS } from "@app-types/image.interface";
import { createContext, useReducer, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  preview?: string;
  status: IMAGESTATUS;
  progress?: number;
  errorMessage?: string;
  reason?: string; // for rejected
  thumbUrl?: string;
  s3Url?: string;
}

interface UploaderState {
  files: UploadFile[];
}

const initialState: UploaderState = {
  files: [],
};

type Action =
  | { type: 'ADD_FILES'; files: UploadFile[] }
  | { type: 'UPDATE_FILE_STATUS'; id: string; status: IMAGESTATUS; progress?: number; errorMessage?: string }
  | { type: 'REMOVE_FILE'; id: string }
  | { type: 'RESET' };

function uploaderReducer(state: UploaderState, action: Action): UploaderState {
  switch (action.type) {
    case 'ADD_FILES': {
      // Use a map to deduplicate by id
      const fileMap: { [id: string]: UploadFile } = {};
      // Add existing files first
      for (const file of state.files) {
        fileMap[file.id] = file;
      }
      // Add/overwrite with new files
      for (const file of action.files) {
        fileMap[file.id] = file;
      }
      return { ...state, files: Object.values(fileMap) };
    }
    case 'UPDATE_FILE_STATUS':
      return {
        ...state,
        files: state.files.map(f =>
          f.id === action.id ? { ...f, status: action.status, progress: action.progress, errorMessage: action.errorMessage } : f
        ),
      };
    case 'REMOVE_FILE':
      return { ...state, files: state.files.filter(f => f.id !== action.id) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface UploaderContextProps extends UploaderState {
  dispatch: Dispatch<Action>;
  loggingIn: boolean;
  setLoggingIn: Dispatch<SetStateAction<boolean>>;
}

export const UploaderContext = createContext<UploaderContextProps | undefined>(undefined);
export function UploaderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uploaderReducer, initialState);
  const [loggingIn, setLoggingIn] = useState(false);
  return (
    <UploaderContext.Provider value={{ ...state, dispatch, loggingIn, setLoggingIn }}>
      {children}
    </UploaderContext.Provider>
  );
}
