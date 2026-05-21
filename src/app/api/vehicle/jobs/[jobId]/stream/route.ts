import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(
          encoder.encode(
            `event: ${event}\n` +
            `data: ${JSON.stringify(data)}\n\n`
          )
        );
      };

      // Initial event
      sendEvent('connected', {
        message: 'SSE connection established',
        jobId,
      });

      // Simulated progress updates
      const steps = [
        { progress: 10, step: 'validating submission' },
        { progress: 40, step: 'saving to database' },
        { progress: 70, step: 'processing vehicle data' },
        { progress: 100, step: 'completed' },
      ];

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        sendEvent(
          step.progress === 100 ? 'completed' : 'progress',
          {
            jobId,
            ...step,
          }
        );
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}