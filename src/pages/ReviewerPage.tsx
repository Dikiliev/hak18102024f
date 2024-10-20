import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';

import {
    acceptApplication,
    rejectApplication,
    uploadDocument,
    IApplicationResponse,
    fetchReviewApplications,
} from './../api/applications';
import ApplicationAccordion from "../components/applications/ApplicationAccordion";

const ReviewerPage: React.FC = () => {
    const [expanded, setExpanded] = useState<number | false>(false);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState('');

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['prorectorApplications'],
        queryFn: fetchReviewApplications,
    });

    const acceptMutation = useMutation({
        mutationFn: acceptApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['reviewerApplications']});
            refetch();
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ applicationId, comment }: { applicationId: number; comment: string }) =>
            rejectApplication(applicationId, comment),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['reviewerApplications']});
            refetch();
        },
    });

    const uploadMutation = useMutation({
        mutationFn: ({ applicationId, file }: { applicationId: number; file: File }) =>
            uploadDocument(applicationId, file),
    });

    const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleAccept = (applicationId: number) => {
        acceptMutation.mutate(applicationId);
    };

    const handleReject = (applicationId: number) => {
        setSelectedApplicationId(applicationId);
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = () => {
        if (selectedApplicationId !== null) {
            rejectMutation.mutate({ applicationId: selectedApplicationId, comment: rejectComment });
        }
        setRejectDialogOpen(false);
        setRejectComment('');
    };

    const handleRejectCancel = () => {
        setRejectDialogOpen(false);
        setRejectComment('');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setDocumentFile(event.target.files[0]);
        }
    };

    const handleUploadDocument = (applicationId: number) => {
        if (documentFile) {
            uploadMutation.mutate({ applicationId, file: documentFile });
            setDocumentFile(null);
        } else {
            alert('Пожалуйста, выберите файл для загрузки.');
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Загрузка заявлений...</Typography>
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
        <Box>
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Заявления, ожидающие проверки
                </Typography>

                <Box sx={{ mt: 2 }}>
                    {data?.map((application, index) => (
                        <Box key={application.id}>
                            <ApplicationAccordion
                                application={application}
                                expanded={expanded}
                                handleAccordionChange={handleAccordionChange(index)}
                                index={index}
                            >
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Box display="flex" justifyContent="end" alignItems="center" gap={2}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleReject(application.id)}
                                        >
                                            Отклонить заявление
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAccept(application.id)}
                                            sx={{ mr: 2 }}
                                        >
                                            Принять заявление
                                        </Button>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={2}>
                                        <input
                                            accept=".pdf,.doc,.docx"
                                            style={{ display: 'none' }}
                                            id={`upload-file-${application.id}`}
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor={`upload-file-${application.id}`}>
                                            <Button variant="outlined" component="span">
                                                Загрузить итоговый документ
                                            </Button>
                                        </label>
                                        {documentFile && (
                                            <Typography variant="body2">{documentFile.name}</Typography>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleUploadDocument(application.id)}
                                        >
                                            Отправить документ
                                        </Button>
                                    </Box>
                                </Box>
                            </ApplicationAccordion>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* Диалог отклонения */}
            <Dialog open={rejectDialogOpen} onClose={handleRejectCancel}>
                <DialogTitle>Отклонить заявление</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Комментарий"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectCancel}>Отмена</Button>
                    <Button onClick={handleRejectConfirm} color="error">
                        Отклонить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewerPage;
