'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEMO_JOB_ID,
  SseEventRecord,
  StreamStatus,
  VEHICLE_JOB_STREAM_URL,
} from './types';

const SSE_EVENT_TYPES = ['connected', 'progress', 'completed'] as const;

function parseEventData(raw: string): Record<string, unknown> {
  return JSON.parse(raw) as Record<string, unknown>;
}

export function useVehicleJobStream() {
  const [events, setEvents] = useState<SseEventRecord[]>([]);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamFinishedRef = useRef(false);

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const appendEvent = useCallback((eventType: string, data: Record<string, unknown>) => {
    setEvents((previous) => [
      ...previous,
      {
        id: `${eventType}-${Date.now()}-${previous.length}`,
        eventType,
        data,
        receivedAt: new Date(),
      },
    ]);
  }, []);

  const simulateServerEvents = useCallback(() => {
    closeStream();
    streamFinishedRef.current = false;
    setEvents([]);
    setErrorMessage(null);
    setStatus('connecting');

    const eventSource = new EventSource(VEHICLE_JOB_STREAM_URL);
    eventSourceRef.current = eventSource;

    const handleNamedEvent = (eventType: string) => (message: MessageEvent<string>) => {
      try {
        const data = parseEventData(message.data);
        appendEvent(eventType, data);
        setStatus('streaming');

        if (eventType === 'completed') {
          streamFinishedRef.current = true;
          setStatus('complete');
          closeStream();
        }
      } catch {
        setErrorMessage('Failed to parse server event payload.');
        setStatus('error');
        closeStream();
      }
    };

    SSE_EVENT_TYPES.forEach((eventType) => {
      eventSource.addEventListener(eventType, handleNamedEvent(eventType));
    });

    eventSource.onerror = () => {
      if (streamFinishedRef.current) {
        closeStream();
        return;
      }

      setErrorMessage('SSE connection failed or was interrupted.');
      setStatus('error');
      closeStream();
    };
  }, [appendEvent, closeStream]);

  useEffect(() => {
    return () => closeStream();
  }, [closeStream]);

  const isSimulating = status === 'connecting' || status === 'streaming';
  const showEventSkeleton = status === 'connecting' && events.length === 0;

  return {
    events,
    status,
    errorMessage,
    jobId: DEMO_JOB_ID,
    simulateServerEvents,
    isSimulating,
    showEventSkeleton,
  };
}
