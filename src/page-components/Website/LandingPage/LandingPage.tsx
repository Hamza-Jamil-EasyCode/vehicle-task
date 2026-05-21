"use client";

import AppButton from "@components/AppButton/AppButton";
import AppCard from "@components/AppCard/AppCard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Alert, Box, Chip, Stack, Typography } from "@mui/material";
import SseEventCard from "./SseEventCard";
import SseEventsSkeleton from "./SseEventsSkeleton";
import { useVehicleJobStream } from "./useVehicleJobStream";

const LandingPage = () => {
  const {
    events,
    status,
    errorMessage,
    jobId,
    simulateServerEvents,
    isSimulating,
    showEventSkeleton,
  } = useVehicleJobStream();

  const hasEvents = events.length > 0;
  const showEmptyState = status === "idle" && !hasEvents;

  return (
    <Stack gap={4}>
      <Stack gap={1} textAlign="center">
        <Typography variant="h4" fontWeight={700}>
          Server-Sent Events Demo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Simulate a vehicle job stream and watch events arrive in real time.
          This UI is for demonstration only — no real submission flow runs here.
        </Typography>
        <Box>
          <Chip label={`Job: ${jobId}`} size="small" variant="outlined" />
        </Box>
      </Stack>

      <Stack alignItems="center">
        <AppButton
          onClick={simulateServerEvents}
          disabled={isSimulating}
          isLoading={isSimulating}
          startIcon={<PlayArrowIcon />}
        >
          Simulate Server Events
        </AppButton>
      </Stack>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {status === "complete" && (
        <Alert severity="success">
          Stream finished — all simulated events received.
        </Alert>
      )}

      <AppCard>
        <Stack gap={2}>
          <Typography variant="h6" fontWeight={600}>
            Live event feed
          </Typography>

          {showEventSkeleton && <SseEventsSkeleton />}

          {showEmptyState && !showEventSkeleton && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              Click the button above to start the SSE simulation.
            </Typography>
          )}

          {hasEvents && (
            <Stack gap={2}>
              {events.map((event) => (
                <SseEventCard key={event.id} event={event} />
              ))}
            </Stack>
          )}
        </Stack>
      </AppCard>
    </Stack>
  );
};

export default LandingPage;
