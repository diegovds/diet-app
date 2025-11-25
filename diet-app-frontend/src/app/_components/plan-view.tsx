import ReactMarkdown from 'react-markdown'

interface PlanViewProps {
  plan: string
}

export function PlanView({ plan }: PlanViewProps) {
  const parts = plan.split(/(?=## Dia \d+)/g)

  const days = parts.map((p) => p.trim()).filter((p) => p.length > 0)

  return (
    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
      {days.map((day, index) => (
        <div
          key={index}
          className="w-full place-self-start rounded-lg bg-white p-4 shadow"
        >
          <ReactMarkdown
            components={{
              h2: (props) => (
                <h2
                  className="mb-1 text-xl font-semibold text-green-600 md:text-2xl"
                  {...props}
                />
              ),
              strong: (props) => (
                <strong className="font-medium text-zinc-900" {...props} />
              ),
              ul: (props) => (
                <ul className="space-y-0.5 text-sm md:text-base" {...props} />
              ),
              li: (props) => <li className="text-zinc-500" {...props} />,
            }}
          >
            {day}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  )
}
