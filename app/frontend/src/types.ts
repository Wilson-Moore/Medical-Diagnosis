export interface Prediction {
  disease: string
  probability: number
}

export interface PredictionResponse {
  screening: {
    abnormal_probability: number
    is_abnormal: boolean
  }

  predictions: Prediction[]
  report: string
  heatmap: string | null
}