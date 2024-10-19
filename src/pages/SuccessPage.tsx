import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Fade, Paper, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import FlexBox from "@components/flexBox/FlexBox";

// Анимация "bounce" для плавного увеличения иконки
const bounceAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const SuccessPage: React.FC = () => {
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Плавное появление галочки с анимацией "bounce"
        setTimeout(() => {
            setChecked(true);
        }, 500);
    }, []);

    const handleToApps = () => {
        navigate('/applications');
    }

    const handleReturn = () => {
        navigate('/');  // Вернуться на главную страницу
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                {/* Плавное появление галочки с анимацией bounce */}
                <Box
                    sx={{
                        display: 'inline-block',
                        animation: `${bounceAnimation} 0.8s ease`,
                        borderRadius: '50%',
                        backgroundColor: '#e0f7fa',  // Светлый фон для круга
                        padding: 2,
                    }}
                >
                    <CheckCircleIcon color={'primary'} sx={{ fontSize: 120 }} />
                </Box>

                <Fade in={true} timeout={1000}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mt: 3 }}>
                        Заявление успешно отправлено!
                    </Typography>
                </Fade>

                <Fade in={true} timeout={1500}>
                    <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
                        Ваше заявление отправлено на проверку. Вы можете отслеживать его статус в личном кабинете.
                    </Typography>
                </Fade>

                <Fade in={true} timeout={2000}>
                    <Box>
                        <FlexBox flexDirection={'column'} gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleToApps}
                                sx={{ px: 8 }}
                            >
                                Мои заявления
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleReturn}
                            >
                                Вернуться на главную
                            </Button>
                        </FlexBox>
                    </Box>
                </Fade>
            </Paper>
        </Container>
    );
};

export default SuccessPage;
