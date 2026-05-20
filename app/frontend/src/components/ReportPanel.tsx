import { motion } from "framer-motion"

interface Props {
  report: string
  modelName?: string
}

export default function ReportPanel({ report, modelName }: Props) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl whitespace-pre-wrap">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>AI Radiology Report</span>
        {modelName && (
          <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded-full">
            {modelName}
          </span>
        )}
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="leading-relaxed"
      >
        {report}
      </motion.p>
    </div>
  )
}