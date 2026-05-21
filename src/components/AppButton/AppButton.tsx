'use client';
import { Button, SxProps, Typography, useTheme } from '@mui/material';
import React, { useRef } from 'react';
import './AppButton.scss';
import Loader from '@components/Loader/Loader';
import { throttle } from '@common/common';

interface AppButtonInterface {
    children: string;
    variant?: 'text' | 'outlined' | 'contained';
    secondaryBtn?: boolean;
    onClick?: (e?: any) => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    sx?: SxProps;
    color?: 'primary' | 'secondary' | 'black' | 'white';
    rounded?: boolean;
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean
}

const AppButton: React.FC<AppButtonInterface> = ({
    children,
    className,
    variant = 'contained',
    onClick,
    type,
    startIcon,
    endIcon,
    disabled,
    color = 'secondary',
    secondaryBtn,
    sx,
    rounded = false,
    size = 'large',
    isLoading
}) => {
    const theme = useTheme();
    const throttledClick = useRef(onClick ? throttle(onClick) : undefined);
    throttledClick.current = onClick ? throttle(onClick) : undefined;
    return (
        <Button
            type={type}
            disabled={disabled || isLoading}
            color={color}
            variant={variant}
            className={`primary-button ${className} ${secondaryBtn ? (theme.palette.mode === 'dark' ? 'dark-secondary-btn' : 'secondary-btn') : ''} ${rounded ? 'rounded-btn' : ''} ${variant === "contained" ? 'contained-btn' : ''}`}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={throttledClick.current}
            sx={sx}
            size={size}
            disableElevation
        >
            {isLoading ? <Loader /> : <Typography>{children}</Typography>}
        </Button>
    );
};

export default AppButton;
