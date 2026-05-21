'use client';

import { Skeleton, Stack } from '@mui/material';

const SKELETON_CARD_COUNT = 3;

const SseEventsSkeleton = () => {
  return (
    <Stack gap={2} aria-label="Loading server events">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <Stack
          key={`sse-skeleton-${index}`}
          gap={1.5}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="rounded" animation="wave" height={28} width={120} />
            <Skeleton variant="rounded" animation="wave" height={20} width={80} />
          </Stack>
          <Skeleton variant="rounded" animation="wave" height={16} width="70%" />
          <Skeleton variant="rounded" animation="wave" height={8} width="100%" />
          <Skeleton variant="rounded" animation="wave" height={16} width="45%" />
        </Stack>
      ))}
    </Stack>
  );
};

export default SseEventsSkeleton;
