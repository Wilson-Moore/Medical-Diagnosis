import { useState } from "react"
import { Activity, Brain, ScanLine, Sparkles, Cpu, Network } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import UploadBox from "../components/UploadBox"
import PredictionCard from "../components/PredictionCard"
import HeatmapViewer from "../components/HeatmapViewer"
import ReportPanel from "../components/ReportPanel"
import ScreeningStatus from "../components/ScreeningStatus"

import { type PredictionResponse, type ModelResults } from "../types"
import { api } from "../api/api"

export default function Home() {
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [currentModel, setCurrentModel] = useState<"efficientnet" | "densenet">("efficientnet")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (file: File) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await api.post<PredictionResponse>("/predict", formData)
      setResult(response.data)
    } catch (error) {
      console.error("Prediction failed:", error)
      alert("Prediction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = (model: "efficientnet" | "densenet") => {
    setCurrentModel(model)
  }

  // Get current model's results
  const currentResults: ModelResults | undefined = result?.[currentModel]
  const modelColor = currentModel === "efficientnet" ? "cyan" : "emerald"
  const modelName = currentModel === "efficientnet" ? "EfficientNet-B1" : "DenseNet121"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute top-0 left-0 w-96 h-96 bg-${modelColor}-500 blur-3xl rounded-full`} />
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
            <span className={`text-${modelColor}-400`}> Chest X-Ray </span>
            Analysis
          </h1>

          <p className="mt-6 text-slate-400 text-lg max-w-2xl leading-relaxed">
            Upload a chest radiograph and switch between EfficientNet-B1 and DenseNet121 
            to compare predictions, GradCAM visualizations, and AI-generated reports.
          </p>
        </motion.div>

        {/* Model Selector Toggle */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Network className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="font-semibold">Compare Models</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* EfficientNet Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModelChange("efficientnet")}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden
                    ${currentModel === "efficientnet" 
                      ? "border-cyan-400 bg-cyan-500/20 shadow-lg" 
                      : "border-cyan-500/30 hover:border-cyan-400/60 bg-white/5"
                    }
                  `}
                >
                  {currentModel === "efficientnet" && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
                  )}
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="font-bold">EfficientNet-B1</span>
                    {currentModel === "efficientnet" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 ml-auto">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 ml-11 relative z-10">
                    High-efficiency CNN with strong performance on medical imaging
                  </p>
                </motion.button>

                {/* DenseNet Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModelChange("densenet")}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden
                    ${currentModel === "densenet" 
                      ? "border-emerald-400 bg-emerald-500/20 shadow-lg" 
                      : "border-emerald-500/30 hover:border-emerald-400/60 bg-white/5"
                    }
                  `}
                >
                  {currentModel === "densenet" && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
                  )}
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Brain className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-bold">DenseNet121</span>
                    {currentModel === "densenet" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 ml-auto">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 ml-11 relative z-10">
                    Densely connected CNN excelling at fine-grained feature extraction
                  </p>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <Activity className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Model Comparison
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Switch between EfficientNet-B1 and DenseNet121 to compare independent predictions and heatmaps.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <Brain className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              AI Radiology Reports
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Each model generates its own structured findings using transformer-based language models.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >
            <ScanLine className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Explainable AI
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Independent GradCAM heatmaps highlight what each model focuses on.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <UploadBox onUpload={handleUpload} isLoading={isLoading} />
        </motion.div>

        <AnimatePresence mode="wait">
          {result && currentResults && (
            <motion.div
              key={currentModel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Model Badge */}
              <div className="flex items-center justify-between">
                <div className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full
                  bg-${modelColor}-500/20 border border-${modelColor}-400/30
                `}>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Viewing: {modelName} Predictions
                  </span>
                </div>
                {result.efficientnet && result.densenet && (
                  <div className="text-xs text-slate-500">
                    Both models have analyzed this image
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {result.screening && (
                    <ScreeningStatus 
                      abnormal={result.screening.is_abnormal}
                      probability={result.screening.abnormal_probability}
                    />
                  )}

                  {currentResults.predictions.length > 0 && (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
                      <h2 className="text-3xl font-bold mb-6">
                        {modelName} Predictions
                      </h2>
                      <div className="space-y-4">
                        {currentResults.predictions.slice(0, 8).map((p, idx) => (
                          <PredictionCard
                            key={p.disease}
                            prediction={p}
                            rank={idx + 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {currentResults.heatmap && (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">
                      <h2 className="text-3xl font-bold mb-6">
                        GradCAM Visualization - {modelName}
                      </h2>
                      <HeatmapViewer heatmap={currentResults.heatmap} />
                      <p className="mt-4 text-sm text-slate-400 text-center">
                        Heatmap shows regions most influential for {modelName}'s top prediction
                      </p>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">
                    <ReportPanel report={currentResults.report} modelName={modelName} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}