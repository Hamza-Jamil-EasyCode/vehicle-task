import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import { useTheme } from '@mui/material';

const ProgressBar = () => {
    const theme = useTheme();
    return <NextTopLoader color={theme.palette.primary.main} easing='ease' />;
};

export default ProgressBar;
