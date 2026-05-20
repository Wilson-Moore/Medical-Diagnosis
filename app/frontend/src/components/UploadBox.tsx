import { type ChangeEvent } from "react"
import { UploadCloud } from "lucide-react"
import { motion } from "framer-motion"

interface Props {
  onUpload: (file: File) => Promise<void>
  isLoading: boolean
}

export default function UploadBox({ onUpload, isLoading }: Props) {
  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await onUpload(file)
  }

  return (
    <motion.label
      whileHover={{ scale: 1.01 }}
      className="block cursor-pointer"
    >
      <div className="border-2 border-dashed border-cyan-500/40 bg-white/5 backdrop-blur-xl rounded-[2rem] p-16 text-center hover:border-cyan-400 transition-all duration-300 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-500/10 p-5 rounded-full border border-cyan-400/20">
            <UploadCloud className="w-14 h-14 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-3">
          Upload Chest X-Ray
        </h2>

        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          Click to browse.
          The AI system will generate predictions, heatmaps,
          and structured radiology reports.
        </p>

        <div className="mt-8 inline-flex px-6 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold shadow-lg">
          Select Image
        </div>

        {isLoading && (
          <div className="mt-8 text-cyan-300 animate-pulse text-lg font-medium">
            Analyzing X-Ray...
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </motion.label>
  )
}