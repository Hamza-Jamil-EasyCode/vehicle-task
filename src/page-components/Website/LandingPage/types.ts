export type StreamStatus = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';

export type SseEventRecord = {
  id: string;
  eventType: string;
  data: Record<string, unknown>;
  receivedAt: Date;
};

export const DEMO_JOB_ID = 'abc123';

export const VEHICLE_JOB_STREAM_URL = `/api/vehicle/jobs/${DEMO_JOB_ID}/stream`;
