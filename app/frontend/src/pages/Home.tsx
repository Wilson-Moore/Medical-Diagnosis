import { useState } from "react"
import { Activity, Brain, ScanLine } from "lucide-react"
import { motion } from "framer-motion"

import UploadBox from "../components/UploadBox"
import PredictionCard from "../components/PredictionCard"
import HeatmapViewer from "../components/HeatmapViewer"
import ReportPanel from "../components/ReportPanel"
import ScreeningStatus from "../components/ScreeningStatus"

import { type PredictionResponse } from "../types"

export default function Home() {

  const [result, setResult] = useState<PredictionResponse | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white overflow-hidden">

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl mb-6">
            <ScanLine className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-300">
              AI-Assisted Chest Radiology Platform
            </span>
          </div>

          <h1 className="text-6xl font-black leading-tight tracking-tight max-w-4xl">
            Intelligent
            <span className="text-cyan-400"> Chest X-Ray </span>
            Analysis
          </h1>

          <p className="mt-6 text-slate-400 text-lg max-w-2xl leading-relaxed">
            Upload a chest radiograph and receive disease predictions,
            GradCAM explainability maps, and AI-generated radiology
            reports powered by deep learning.
          </p>

        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <Activity className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Multi-Label Detection
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              EfficientNet identifies thoracic abnormalities with
              probability-based multi-label predictions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <Brain className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              AI Radiology Reports
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically generated structured findings and impression
              sections using transformer-based language models.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <ScanLine className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Explainable AI
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Visual GradCAM heatmaps highlight the image regions most
              influential to the model decision.
            </p>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <UploadBox setResult={setResult} />
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >

            <div className="space-y-6">

              {/* Screening Status Component */}
              {result.screening && (
                <ScreeningStatus 
                  abnormal={result.screening.is_abnormal}
                  probability={result.screening.abnormal_probability}
                />
              )}

              {result.predictions.length > 0 && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
                  <h2 className="text-3xl font-bold mb-6">
                    Prediction Confidence
                  </h2>

                  <div className="space-y-4">
                    {result.predictions.map((p) => (
                      <PredictionCard
                        key={p.disease}
                        prediction={p}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="space-y-8">

              {result.heatmap && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">
                  <h2 className="text-3xl font-bold mb-6">
                    GradCAM Visualization
                  </h2>

                  <HeatmapViewer heatmap={result.heatmap} />
                </div>
              )}

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">
                <ReportPanel report={result.report} />
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </div>
  )
}