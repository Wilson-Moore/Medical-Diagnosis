export interface Prediction {
  disease: string
  probability: number
}

export interface ScreeningResult {
  is_abnormal: boolean
  abnormal_probability: number
}

export interface PredictionResponse {
  predictions: Prediction[]
  heatmap?: string
  report: string
  screening?: ScreeningResult
}

export type RootStackParamList = {
  Home: undefined
  Results: undefined
  ReportDetail: undefined
  HeatmapDetail: undefined
}
