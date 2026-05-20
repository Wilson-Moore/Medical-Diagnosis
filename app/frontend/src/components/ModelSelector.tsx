import { motion } from "framer-motion"
import { Cpu, Brain } from "lucide-react"

interface ModelSelectorProps {
  currentModel: string
  onModelChange: (model: string) => void
}

const models = {
  efficientnet: {
    name: "EfficientNet-B1",
    icon: Cpu,
    color: "cyan",
    description: "Efficient CNN architecture"
  },
  densenet: {
    name: "DenseNet121",
    icon: Brain,
    color: "emerald",
    description: "Densely connected network"
  }
}

export default function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="font-semibold">Select AI Model</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(models).map(([key, model]) => {
          const isActive = currentModel === key
          const Icon = model.icon
          const color = model.color
          
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onModelChange(key)}
              className={`
                p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden
                ${isActive 
                  ? `border-${color}-400 bg-${color}-500/20 shadow-lg` 
                  : `border-${color}-500/30 hover:border-${color}-400/60 bg-white/5`
                }
              `}
            >
              {isActive && (
                <div className={`absolute top-0 right-0 w-20 h-20 bg-${color}-500/20 rounded-full blur-2xl -mr-10 -mt-10`} />
              )}
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <span className="font-bold">
                  {model.name}
                </span>
                {isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 ml-auto">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 ml-11 relative z-10">
                {model.description}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}