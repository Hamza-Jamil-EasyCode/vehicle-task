import { Skeleton, Stack } from '@mui/material';
import React from 'react';

const ComponentLoader = () => {
    return (
        <Stack gap={3} sx={{ padding: '20px' }}>
            {/* Title */}
            <Skeleton variant="rounded" animation="wave" height={32} width="40%" />

            {/* Text lines */}
            <Stack gap={1.5}>
                <Skeleton variant="rounded" animation="wave" height={16} />
                <Skeleton variant="rounded" animation="wave" height={16} width="60%" />
                <Skeleton variant="rounded" animation="wave" height={16} width="50%" />
            </Stack>

            {/* Main content block */}
            {/* <Skeleton variant="rounded" animation="wave" height={220} /> */}

            {/* Footer / list items */}
            <Stack gap={1.5}>
                <Skeleton variant="rounded" animation="wave" height={16} width="60%" />
                <Skeleton variant="rounded" animation="wave" height={16} width="30%" />
            </Stack>
        </Stack>
    );
};

export default ComponentLoader;
