'use client';

import AppCard from '@components/AppCard/AppCard';
import { Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { SseEventRecord } from './types';

type SseEventCardProps = {
  event: SseEventRecord;
};

function getEventChipColor(
  eventType: string
): 'default' | 'primary' | 'success' | 'info' {
  if (eventType === 'completed') {
    return 'success';
  }
  if (eventType === 'progress') {
    return 'primary';
  }
  if (eventType === 'connected') {
    return 'info';
  }
  return 'default';
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const SseEventCard = ({ event }: SseEventCardProps) => {
  const progress =
    typeof event.data.progress === 'number' ? event.data.progress : null;
  const step = typeof event.data.step === 'string' ? event.data.step : null;
  const message =
    typeof event.data.message === 'string' ? event.data.message : null;
  const jobId = typeof event.data.jobId === 'string' ? event.data.jobId : null;

  return (
    <AppCard childCard>
      <Stack gap={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip
            label={event.eventType}
            color={getEventChipColor(event.eventType)}
            size="small"
            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(event.receivedAt)}
          </Typography>
        </Stack>

        {message && (
          <Typography variant="body2" color="text.primary">
            {message}
          </Typography>
        )}

        {step && (
          <Typography variant="body2" color="text.secondary">
            Step: {step}
          </Typography>
        )}

        {jobId && (
          <Typography variant="caption" color="text.secondary">
            Job ID: {jobId}
          </Typography>
        )}

        {progress !== null && (
          <Stack gap={0.5}>
            <Typography variant="caption" color="text.secondary">
              Progress: {progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Stack>
        )}
      </Stack>
    </AppCard>
  );
};

export default SseEventCard;
