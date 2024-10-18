import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import theme from '@styles/theme';

interface FixedBottomBarProps {
    totalAmount: number;
    isCheckoutDisabled: boolean;
    onCheckout: () => void;
}

const FixedBottomBar: React.FC<FixedBottomBarProps> = ({ totalAmount, isCheckoutDisabled, onCheckout }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0px -2px 10px rgba(0, 0, 0, 0.1)`,
                padding: theme.spacing(2),
                display: { xs: 'flex', sm: 'none' }, // Only visible on mobile devices
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                Сумма: {totalAmount.toLocaleString('ru-RU')} ₽
            </Typography>
            <Button
                variant='contained'
                color='primary'
                onClick={onCheckout}
                disabled={isCheckoutDisabled}
                sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    padding: theme.spacing(1, 4),
                    borderRadius: 2,
                }}
            >
                Оформить
            </Button>
        </Box>
    );
};

export default FixedBottomBar;
