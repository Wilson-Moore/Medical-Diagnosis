interface Props {
  abnormal: boolean
  probability: number
}

export default function ScreeningStatus({
  abnormal,
  probability,
}: Props) {

  return (
    <div
      className={`
        rounded-3xl p-6 border backdrop-blur-xl
        ${abnormal
          ? "bg-red-500/10 border-red-400/20"
          : "bg-emerald-500/10 border-emerald-400/20"
        }
      `}
    >

      <h2 className="text-2xl font-bold mb-3">
        Screening Result
      </h2>

      <div className="text-lg">
        {abnormal
          ? "Abnormal Findings Detected"
          : "No Abnormality Detected"}
      </div>

      <div className="mt-2 text-slate-300">
        Confidence:
        {" "}
        {(probability * 100).toFixed(1)}%
      </div>

    </div>
  )
}