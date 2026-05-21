import AppButton from '@components/AppButton/AppButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import React from 'react';

const BackButton:React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    const router = useRouter();
    return (
        <AppButton
            variant="text"
            startIcon={<ChevronLeftIcon />}
            color="primary"
            onClick={() => {
                onClick ? onClick() : router.push('/')
            }}
        >
            Back
        </AppButton>
    );
};

export default BackButton;
