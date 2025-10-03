// useUpload.ts
import { useEffect, useRef, useState } from "react"
import { useAlert } from "@contexts/AlertContext"
import {
  FunctionType,
  IMAGESTATUS,
  UploadHandler,
  UploadResults,
} from "@app-types/image.interface"
import Network from "@utils/network"
import { useLogin } from "./useLogin"
import { ERROR_MESSAGES } from "@config/constants"

export function generateFileKey(file: File | { name: string }) {
  return "size" in file
    ? `${file.name}_${file.size}_${file.type}_${file.lastModified}`
    : file.name + "-preexisting-" + Date.now()
}
const SUCCESS_RESULT = {
  progress: 100,
}

const FAILED_RESULT = {
  status: IMAGESTATUS.FAILED,
  progress: 0,
}

const useUpload = (
  endpointOrHandler: string | UploadHandler,
  isSequential?: boolean,
  files?: Array<File | { name: string; url?: string }>,
) => {
  const [results, setResults] = useState<UploadResults>()
  const clearActionRef = useRef<{ [key: string]: boolean }>({})
  const intervalRef = useRef<{ [key: string]: NodeJS.Timeout }>({})
  const { setLoggingIn } = useLogin()!
  const { showAlert } = useAlert()

  useEffect(() => {
    if (files) {
      const results: UploadResults = {}
      files?.forEach((file) => {
        results[generateFileKey(file)] = {
          ...file,
          progress: 100,
          status: IMAGESTATUS.UPLOADED,
          file: typeof file === "object" ? file : { name: (file as File).name },
        }
      })
      setResults(results)
    }
  }, [files])

  useEffect(() => {
    const interval = intervalRef.current
    return () => {
      Object.keys(interval).forEach((key) => clearInterval(interval[key]))
    }
  }, [intervalRef])

  const clear = (fileId?: string) => {
    if (fileId) {
      const resultsClone = { ...results }
      delete resultsClone[fileId]
      setResults(resultsClone)
      clearActionRef.current[fileId] = true
      clearInterval(intervalRef.current[fileId])
    } else {
      setResults(undefined)
      results &&
        Object.keys(results).forEach(
          (key) =>
            results[key].status === IMAGESTATUS.PENDING &&
            (clearActionRef.current[key] = true),
        )
      Object.keys(intervalRef.current).forEach((key) =>
        clearInterval(intervalRef.current[key]),
      )
    }
  }

  const uploadFile = async (file: File) => {
    const isHandler = typeof endpointOrHandler === "function"
    const handler = isHandler ? (endpointOrHandler as UploadHandler) : null
    const fileKey = generateFileKey(file)
    intervalRef.current[fileKey] = setInterval(() => {
      setResults((prevResult) => {
        const prevResultObj = prevResult && prevResult[fileKey as string]
        if (!prevResultObj || prevResultObj.progress >= 95) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current[fileKey])
          }
          return prevResult
        }
        const increment = Math.floor(Math.random() * 8) + 5
        return {
          ...prevResult,
          [fileKey]: {
            ...prevResultObj,
            progress: prevResultObj.progress + increment,
          },
        }
      })
    }, 500)

    if (handler) {
      // ...existing code...
      return await handler(file)
        .then((res) => {
          if (!clearActionRef.current[fileKey]) {
            if (!res.ok) {
              setResults((prevResult) => {
                return {
                  ...prevResult,
                  [fileKey]: { file, ...FAILED_RESULT },
                }
              })
            }
            setResults((prevResult) => ({
              ...prevResult,
              [fileKey]: {
                file,
                status: IMAGESTATUS.UPLOADED,
                ...SUCCESS_RESULT,
              },
            }))
          }
        })
        .catch(() => {
          if (!clearActionRef.current[fileKey]) {
            setResults((prevResult) => {
              return {
                ...prevResult,
                [fileKey]: { file, ...FAILED_RESULT },
              }
            })
          }
        })
        .finally(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current[fileKey])
          }
        })
    } else {
      // Dispatch alerts for endpoint uploads
      return await Network.upload(endpointOrHandler as string, file)
        .then((response) => {
          if (!clearActionRef.current[fileKey]) {
            if (!response.results) {
              setResults((prevResult) => {
                return {
                  ...prevResult,
                  [fileKey]: {
                    file,
                    ...FAILED_RESULT,
                    error: response.message || "Upload failed",
                    httpStatus: response.status,
                  },
                }
              })
              if (showAlert) {
                showAlert(
                  `Failed to upload ${file.name}${
                    response.message ? ": " + response.message : ""
                  }`,
                  "error",
                )
              }
              return
            }

            const savedRecord = response.results[0]
            setResults((prevResult) => {
              return {
                ...prevResult,
                [fileKey]: { ...(savedRecord || {}), file, ...SUCCESS_RESULT },
              }
            })
            if (showAlert) {
              showAlert(`Uploaded ${file.name} successfully`, "success")
            }
          } else {
            delete clearActionRef.current[fileKey]
            delete intervalRef.current[fileKey]
          }
        })
        .catch((error) => {
          if (!clearActionRef.current[fileKey]) {
            setResults((prevResult) => {
              return {
                ...prevResult,
                [fileKey]: { file, ...FAILED_RESULT, error },
              }
            })
            if (showAlert) {
              showAlert(
                `Failed to upload ${file.name}${
                  error?.message ? ": " + error.message : ""
                }`,
                "error",
              )
            }
          } else {
            delete clearActionRef.current[fileKey]
            delete intervalRef.current[fileKey]
          }
          if (error.message === ERROR_MESSAGES["403"]) {
            setLoggingIn(true)
          }
        })
        .finally(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current[fileKey])
          }
        })
    }
  }

  const upload = async (
    newFiles: File[],
    callback?: FunctionType,
    shouldAppend?: boolean,
  ) => {
    const newResults: UploadResults = {}
    newFiles.forEach((file) => {
      const fileKey = generateFileKey(file)
      newResults[fileKey] = {
        file,
        status: IMAGESTATUS.PENDING,
        progress: isSequential ? 1 : Math.floor(Math.random() * 10),
      }
    })

    setResults(shouldAppend ? { ...results, ...newResults } : newResults)

    let promises = []

    for (const file of newFiles) {
      if (isSequential) {
        promises.push(await uploadFile(file))
      } else {
        promises.push(uploadFile(file))
      }
    }
    await Promise.allSettled(promises).then(
      (responses) => callback && callback(responses),
    )
  }

  return { clear, upload, results }
}

export default useUpload
