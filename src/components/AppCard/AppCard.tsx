'use client'
import { Card, SxProps, useTheme } from '@mui/material'
import React from 'react'
import './AppCard.scss'

interface AppCardInterface {
    hover?: boolean
    children: any
    className?: string
    onClick?: (e?:any) => void
    sx?: SxProps
    elevation?: number
    childCard?: boolean
}

const AppCard:React.FC<AppCardInterface> = ({ hover = false, className, onClick, children, sx, elevation = 0, childCard = false }) => {
  const theme = useTheme();
  const hoverStyles = hover ? {
    transform: 'scale(1)',
    transition: 'transform 0.1s ease-out',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  } : {};
  
  return (
    <Card 
      elevation={elevation} 
      className={`app-card-wrapper ${hover && 'hover-card'} ${theme.palette.mode === 'dark' ? 'dark-card' : 'light-card'} ${childCard ? "child-card" : ""} ${className}`} 
      sx={{ ...hoverStyles, ...sx }} 
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

export default AppCard
