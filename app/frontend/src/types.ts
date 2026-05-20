export interface Prediction {
  disease: string
  probability: number
}

export interface ModelResults {
  predictions: Prediction[]
  report: string
  heatmap: string | null
}

export interface PredictionResponse {
  screening: {
    abnormal_probability: number
    is_abnormal: boolean
  }
  efficientnet: ModelResults
  densenet: ModelResults
}