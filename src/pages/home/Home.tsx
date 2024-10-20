import React from 'react';
import { Typography, Button, Container, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import theme from '../../styles/theme.ts';

const Background = styled('div')({
    backgroundImage: 'url(6204017.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 0',
    color: '#fff',
});

const Overlay = styled('div')({
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '80px 0',
});

const Home = () => {
    const navigate = useNavigate();

    const selectType = () => {
        navigate(`/select-application-type`);
    };

    return (
        <>
            <Box sx={{ backgroundColor: '#f5f5f5', pt: 6 }}>
                <Container maxWidth="lg">
                    <Paper
                        sx={{
                            borderRadius: '40px 10px 60px 30px', // Начальное состояние радиусов
                            animation: 'borderAnimation 10s infinite alternate', // Анимация для смены радиусов
                            overflow: 'hidden',
                            '@keyframes borderAnimation': {
                                '0%': {
                                    borderRadius: '240px 72px 240px 72px',
                                },
                                '50%': {
                                    borderRadius: '280px 48px 280px 48px',
                                },
                                '100%': {
                                    borderRadius: '240px 72px 240px 72px',
                                },
                            },
                        }}
                    >
                        <Grid container spacing={0} alignItems="center" p={0}>

                            <Grid item xs={12} md={5}>
                                <Box sx={{ textAlign: 'center', overflow: 'hidden', p: 0 }}>
                                    <img
                                        src="/6204017.jpg"
                                        alt="Иллюстрация"
                                        style={{ maxWidth: '100%', height: 'inherit%', p: 0 }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={0.5} sx={{ py: 2 }}>

                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Добро пожаловать!
                                </Typography>
                                <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
                                    Автоматизированная система для подачи заявлений и получения справок.
                                </Typography>
                                <Button variant="contained" color="primary" size="large" onClick={selectType}>
                                    Подать заявление
                                </Button>
                            </Grid>

                        </Grid>
                    </Paper>
                </Container>
            </Box>

            <Container sx={{ py: 6 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
                    Наши преимущества
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <SpeedIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Быстрота и удобство
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Подайте заявление в несколько кликов без необходимости посещения университета.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <SecurityIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Безопасность данных
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Ваши персональные данные надежно защищены современными технологиями безопасности.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <AssignmentTurnedInIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Отслеживание статуса
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Получайте обновления о статусе вашего заявления в режиме реального времени.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <SupportAgentIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Круглосуточная поддержка
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Наша служба поддержки всегда готова помочь вам в любое время суток.
                            </Typography>
                            <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/chat')}>
                                Связаться с нами
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <EmojiEventsIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Эффективность процесса
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Оптимизированные процессы позволяют сократить время обработки заявлений.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 6 }}>
                <Container sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Начните использовать систему уже сегодня!
                    </Typography>
                    <Button variant="contained" sx={{ backgroundColor: 'white', color: theme.palette.primary.main, fontWeight: 'bold'}} size="large" onClick={selectType}>
                        Подать заявление
                    </Button>
                </Container>
            </Box>
        </>
    );
};

export default Home;
