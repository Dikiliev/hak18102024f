import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {Container, Grid, Typography, Paper, Button, CircularProgress, Alert, Box} from '@mui/material';
import { fetchApplicationTypes } from '@api/applications';
import {useNavigate} from "react-router-dom"; // Импорт API-функции

const SelectApplicationType = () => {
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['applicationTypes'],
        queryFn: fetchApplicationTypes,
    });

    const handleSelectType = (id: number) => {
        navigate(`/submit-application/${id}`)
    }

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Загрузка типов заявлений...</Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <Alert severity="error">Ошибка при загрузке данных: {error.message}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Выберите тип заявления
            </Typography>
            <Grid container spacing={2}>
                {data?.map((type) => (
                    <Grid item xs={12} sm={6} key={type.id} sx={{ display: 'flex' }}>
                        <Paper
                            elevation={20}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                p: 4,
                                pb: 2,
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {type.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                    {type.description}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSelectType(type.id)}
                            >
                                Выбрать
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SelectApplicationType;
