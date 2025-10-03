export enum IMAGESTATUS {
  UPLOADED = "UPLOADED",
  PROCESSING = "PROCESSING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  FAILED = "FAILED",
  DUPLICATE = "DUPLICATE",
  DELETED = "DELETED",
}

export type FunctionType = (...args: Array<any>) => any
export type UploadHandler = (file: File) => Promise<UploadResults>

export interface UploadResult {
  file:
    | File
    | {
        name: string
      }
  imageProps?: Partial<ImageProps>
  status: IMAGESTATUS
  progress: number
  type?: string
  url?: string
  error?: string
  httpStatus?: number
}
export type UploadResults = {
  [key: string]: UploadResult
}

export interface ImageProps {
  image: string
  alt?: string
  title?: string
  fill?: boolean
  preserveAspectRatio?: boolean
  flipHorizontal?: boolean
  flipVertical?: boolean
  rotateBy?: number
  opacity?: number
  brightness?: number
  contrast?: number
  saturate?: number
  scale?: number
  blur?: number
  grayscale?: number
  sepia?: number
  isBackground?: boolean
  customBgZIndex?: number
}

export type ObjectType = {
  [key: string]:
    | string
    | Date
    | number
    | boolean
    | null
    | undefined
    | ObjectType
    | ArrayType
    | FunctionType
}

export type ArrayType = Array<string | number | boolean | ObjectType>
