import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, Grow } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { motion } from 'framer-motion';

const OrderSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Допустим, что можно получить номер заказа из состояния или URL.
        // Если нет номера заказа, перенаправляем пользователя.
        const orderNumber = Math.floor(Math.random() * 1000000); // Замените на реальный источник
        if (!orderNumber) {
            navigate('/');
        }
    }, [navigate]);

    const handleGoToOrders = () => {
        navigate('/orders');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth='sm' sx={{ py: 6 }}>
            <Grow in={true}>
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        borderRadius: 4,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    </motion.div>
                    <Typography variant='h4' gutterBottom>
                        Спасибо за ваш заказ!
                    </Typography>
                    <Typography variant='body1' color='textSecondary' gutterBottom>
                        Ваш заказ успешно оформлен. Мы свяжемся с вами для подтверждения и отправки.
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Button variant='contained' color='primary' onClick={handleGoToOrders} sx={{ mb: 2, width: '100%' }}>
                                Посмотреть мои заказы
                            </Button>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            <Button variant='outlined' color='primary' onClick={handleGoHome} sx={{ width: '100%' }}>
                                Вернуться на главную
                            </Button>
                        </motion.div>
                    </Box>
                </Paper>
            </Grow>
        </Container>
    );
};

export default OrderSuccessPage;
