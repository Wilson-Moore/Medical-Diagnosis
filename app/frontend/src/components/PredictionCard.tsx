import { type Prediction } from "../types"

interface Props {
  prediction: Prediction
}

export default function PredictionCard({ prediction }: Props) {

  return (
    <div className="bg-slate-800 p-4 rounded-2xl mb-4">

      <div className="flex justify-between">

        <div>
          {prediction.disease}
        </div>

        <div>
          {(prediction.probability * 100).toFixed(1)}%
        </div>

      </div>

      <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-cyan-400 h-2 rounded-full"
          style={{
            width: `${prediction.probability * 100}%`,
          }}
        />
      </div>

    </div>
  )
}