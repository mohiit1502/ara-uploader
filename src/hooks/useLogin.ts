import { UploaderContext } from "@contexts/UploaderContext"
import { useContext } from "react"

export const useLogin = () => {
  const ctx = useContext(UploaderContext)
  if (!ctx) {
    throw new Error("useLogin must be used within a UploaderProvider")
  }
  return { isLoggingIn: ctx.loggingIn, setLoggingIn: ctx.setLoggingIn }
}
