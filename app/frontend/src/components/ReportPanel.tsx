interface Props {
  report: string
}

export default function ReportPanel({ report }: Props) {

  return (
    <div className="bg-slate-800 p-6 rounded-2xl whitespace-pre-wrap">

      <h2 className="text-2xl font-bold mb-4">
        AI Radiology Report
      </h2>

      <p>{report}</p>

    </div>
  )
}