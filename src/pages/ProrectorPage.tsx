import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
    fetchProrectorApplications,
    signApplication,
    rejectApplication, IApplicationResponse,
} from './../api/applications';
import ApplicationAccordion from "../components/applications/ApplicationAccordion";
import SignatureField from './SignatureField';
import PDFViewerModal from '../components/PDFViewerModal';
import { useUser } from '../hooks/useUser';

const ProrectorPage: React.FC = () => {
    const [expanded, setExpanded] = useState<number | false>(false);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    // Состояния для диалога отклонения
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectComment, setRejectComment] = useState('');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['prorectorApplications'],
        queryFn: fetchProrectorApplications,
    });

    const signMutation = useMutation({
        mutationFn: (applicationId: number) => signApplication(applicationId, signatureFile),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ applicationId, comment }: { applicationId: number; comment: string }) =>
            rejectApplication(applicationId, comment),
    });

    const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSignatureFile(e.target.files[0]);
        }
    };

    const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSign = (applicationId: number) => {
        signMutation.mutate(applicationId);
    };

    // Обработка отклонения заявления
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

    const [open, setOpen] = useState(false);
    const handleSetOpen = (value: boolean) => {
        setOpen(value);
    }

    const handleOpenSignature = (application: IApplicationResponse) => {
        handleSetOpen(true);
    }

    const pdfUrl = '/input.pdf';
    const { user } = useUser();
    const userSignatureUrl = user?.signature;

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

    if (!userSignatureUrl) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Заявления, ожидающие подписания
                </Typography>

                <SignatureField/>

                <PDFViewerModal isOpen={open} setClose={handleSetOpen} url={pdfUrl} signatureImageUrl={userSignatureUrl} />

                <Box sx={{mt: 2}}>
                    {data?.map((application, index) => (
                        <Box key={application.id}>
                            <ApplicationAccordion
                                application={application}
                                expanded={expanded}
                                handleAccordionChange={handleAccordionChange(index)}
                                index={index}
                            >
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
                                        onClick={() => handleOpenSignature(application)}
                                        sx={{ mr: 2 }}
                                    >
                                        Подписать заявление
                                    </Button>
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

export default ProrectorPage;
