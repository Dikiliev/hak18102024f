import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingBox = ({ minHeight = '250px' }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: minHeight }}>
            <CircularProgress />
        </Box>
    );
};

export default LoadingBox;
