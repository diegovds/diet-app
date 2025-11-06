'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DietData } from '@/types/diet-data'
import { Loader, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export function DietGenerator({ data }: { data: DietData }) {
  const [output, setOutput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const controllerRef = useRef<AbortController | null>(null)

  async function startStreaming() {
    const controller = new AbortController()
    controllerRef.current = controller

    setOutput('')
    setIsStreaming(true)

    try {
      const response = await fetch('http://localhost:3333/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          age: data.age,
          height: data.height,
          weight: data.weight,
          genre: data.genre,
          activity_level: data.activityLevel,
          goal: data.goal,
        }),

        // PERMITE CANCELAR A REQ A QUALQUER MOMENTO
        signal: controller.signal,
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        setOutput((prev) => prev + decoder.decode(value))
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('REQUEST CANCELADA')
        return
      }

      console.log(err)
    } finally {
      setIsStreaming(false)
      controllerRef.current = null
    }
  }

  async function handleGenerate() {
    if (isStreaming) {
      controllerRef.current?.abort()
      setIsStreaming(false)
      return
    }

    await startStreaming()
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 p-5">
        <div className="flex justify-center gap-4">
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? (
              <Loader className="animate-spin" />
            ) : (
              <Sparkles name="w-6 h-6" />
            )}
            {isStreaming ? 'Parar dieta' : 'Gerar dieta'}
          </Button>
        </div>

        {output && (
          <div className="bg-card border-border max-h-[500px] overflow-y-auto rounded-lg border p-6">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="my-1 text-xl font-bold text-green-600"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="mb-1 text-2xl font-bold text-zinc-900"
                      {...props}
                    />
                  ),
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
