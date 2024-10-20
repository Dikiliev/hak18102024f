import React from 'react';
import SupportChat from './SupportChat';
import { Box, Container, Paper, Typography } from '@mui/material';

const SupportPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" gutterBottom>
                Свяжитесь с Поддержкой
            </Typography>
            <SupportChat />
        </Container>
    );
};

export default SupportPage;
