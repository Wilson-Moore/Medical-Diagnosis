interface Props {
  heatmap: string
}

export default function HeatmapViewer({ heatmap }: Props) {

  return (
    <div className="bg-slate-800 p-4 rounded-2xl">

      <img
        src={`data:image/png;base64,${heatmap}`}
        alt="heatmap"
        className="rounded-xl"
      />

    </div>
  )
}