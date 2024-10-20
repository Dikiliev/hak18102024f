import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Container,
    Typography,
    Box,

    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchApplications, revokeApplication, downloadApplication } from '@api/applications';

import ApplicationAccordion from "../components/applications/ApplicationAccordion";

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
                <Box key={application.id}>
                    <ApplicationAccordion
                        application={application}
                        expanded={expanded}
                        handleAccordionChange={handleAccordionChange(index)}
                        index={index}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            {application.status === 'completed' && application.ready_document ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleDownload(application.ready_document)}
                                    sx={{ mr: 2 }}
                                >
                                    Скачать готовый документ
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
                    </ApplicationAccordion>
                </Box>
            ))}
        </Container>
    );
};

export default ApplicationListPage;
