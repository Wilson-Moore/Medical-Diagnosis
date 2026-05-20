import { motion } from "framer-motion"
import { type Prediction } from "../types"

interface Props {
  prediction: Prediction
  rank?: number
}

export default function PredictionCard({ prediction, rank }: Props) {
  const getRankColor = (rank?: number) => {
    if (!rank) return "bg-cyan-400"
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-500"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400"
    if (rank === 3) return "bg-gradient-to-r from-amber-600 to-amber-700"
    return "bg-cyan-400"
  }

  return (
    <div className="bg-slate-800/50 p-4 rounded-2xl mb-4 hover:bg-slate-800/70 transition-all duration-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {rank && rank <= 3 && (
            <span className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600"}
            `}>
              {rank}
            </span>
          )}
          <span className="font-medium">
            {prediction.disease}
          </span>
        </div>
        <span className="text-sm text-slate-300">
          {(prediction.probability * 100).toFixed(1)}%
        </span>
      </div>

      <div className="mt-2 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${prediction.probability * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-2 rounded-full ${getRankColor(rank)}`}
        />
      </div>
    </div>
  )
}