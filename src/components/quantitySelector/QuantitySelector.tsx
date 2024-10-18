// src/components/QuantitySelector/QuantitySelector.tsx

import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    isLoading: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onIncrease, onDecrease, isLoading }) => {
    return (
        <Box display='flex' alignItems='center'>
            <IconButton onClick={onDecrease} disabled={quantity <= 1 || isLoading}>
                <RemoveIcon />
            </IconButton>
            <Typography variant='body1'>{quantity}</Typography>
            <IconButton onClick={onIncrease} disabled={isLoading}>
                <AddIcon />
            </IconButton>
        </Box>
    );
};

export default QuantitySelector;
