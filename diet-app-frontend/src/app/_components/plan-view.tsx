import ReactMarkdown from 'react-markdown'

interface PlanViewProps {
  plan: string
}

export function PlanView({ plan }: PlanViewProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <div className="bg-card border-border max-h-[500px] overflow-y-auto rounded-lg border p-4 md:p-6">
        <div className="max-w-none">
          <ReactMarkdown
            components={{
              h2: (props) => (
                <h2
                  className="my-1 text-xl font-bold text-green-600"
                  {...props}
                />
              ),
              h1: (props) => (
                <h1
                  className="mb-1 text-2xl font-bold text-zinc-900"
                  {...props}
                />
              ),
            }}
          >
            {plan}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
