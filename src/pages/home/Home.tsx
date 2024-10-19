import React from 'react';
import { Typography, Button, Container, Box, Grid, Paper } from '@mui/material';
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const selectType = () => {
        navigate(`/select-application-type`);
    };

    return (
        <Container>
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Добро пожаловать!
                </Typography>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
                    Автоматизированная система для подачи заявлений и получения справок.
                </Typography>
                <Button variant="contained" color="primary" size="large" onClick={() => selectType()}>
                    Подать заявление
                </Button>
            </Box>

            <Box sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Управление заявками
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                Быстрое и удобное управление вашими заявлениями. Проверьте статус или подайте новое заявление.
                            </Typography>
                            <Button variant="outlined" color="primary">
                                Проверить статус
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Поддержка пользователей
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                Если у вас есть вопросы или проблемы, обратитесь в службу поддержки для быстрой помощи.
                            </Typography>
                            <Button variant="outlined" color="primary">
                                Связаться с нами
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;
