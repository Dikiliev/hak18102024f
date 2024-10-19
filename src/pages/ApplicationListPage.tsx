import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Container,
    Typography,
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { fetchApplications, revokeApplication, downloadApplication } from '@api/applications';
import theme from "@styles/theme";

const ApplicationListPage: React.FC = () => {
    const [expanded, setExpanded] = useState<number | false>(false);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['applications'],
        queryFn: fetchApplications,
    });

    const revokeMutation = useMutation({
        mutationFn: (applicationId: number) => revokeApplication(applicationId),
    });

    const downloadMutation = useMutation({
        mutationFn: (documentUrl: string) => downloadApplication(documentUrl),
    });

    const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleRevoke = (applicationId: number) => {
        revokeMutation.mutate(applicationId);
    };

    const handleDownload = (documentUrl: string | null) => {
        if (!documentUrl) {
            return;
        }
        downloadMutation.mutate(documentUrl);
    };

    const renderStatusChip = (status: string) => {
        switch (status) {
            case 'created':
                return <Chip label="Создано" color="primary" icon={<CheckCircleIcon />} />;
            case 'under_review':
                return <Chip label="Проверяется" color="warning" />;
            case 'in_progress':
                return <Chip label="В процессе" color="info" />;
            case 'completed':
                return <Chip label="Готово" color="success" icon={<CheckCircleIcon />} />;
            default:
                return <Chip label="Неизвестно" />;
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Загрузка списка заявлений...</Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <Alert severity="error">Ошибка при загрузке данных: {error?.message}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Ваши заявления
            </Typography>

            {data?.map((application, index) => (
                <Accordion
                    key={application.id}
                    expanded={expanded === index}
                    onChange={handleAccordionChange(index)}
                    sx={{ borderRadius: 1, mb: 2, backgroundColor: theme.palette.background.paper, overflow: 'hidden' }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {application.application_type.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                {renderStatusChip(application.status)}
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(application.submission_date).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Box mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Детали заявления:</Typography>
                            {Object.entries(JSON.parse(application.fields_data)).map(([field, value], idx) => (
                                <Typography key={idx}>
                                    {field}: {value as string}
                                </Typography>
                            ))}
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {application.status === 'completed' && application.ready_document ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleDownload(application.ready_document)}
                                    sx={{ mr: 2 }}
                                >
                                    Скачать документ
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRevoke(application.id)}
                                    disabled={application.status !== 'created'}
                                    startIcon={<CloseIcon />}
                                >
                                    Отозвать заявление
                                </Button>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
};

export default ApplicationListPage;
