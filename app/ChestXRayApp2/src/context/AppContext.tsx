import React, { createContext, useContext, useState, ReactNode } from "react"
import { type PredictionResponse } from "../types"

interface AppState {
  result: PredictionResponse | null
  setResult: (r: PredictionResponse | null) => void
  imageUri: string | null
  setImageUri: (uri: string | null) => void
  clearAll: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [imageUri, setImageUri] = useState<string | null>(null)

  function clearAll() {
    setResult(null)
    setImageUri(null)
  }

  return (
    <AppContext.Provider value={{ result, setResult, imageUri, setImageUri, clearAll }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}
