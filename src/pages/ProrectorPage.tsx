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

import {
    fetchProrectorApplications,
    signApplication,
    rejectApplication,
} from './../api/applications';
import ApplicationAccordion from "../components/applications/ApplicationAccordion";
import PdfSignatureModal from "../components/PdfSignatureModal.tsx";
import PDFViewerWithSignature from '../components/PDFViewerWithSignature.tsx';
import PDFViewer from '../components/PDFViewerWithSignature.tsx';
import SignatureField from './SignatureField.tsx';


const ProrectorPage: React.FC = () => {
    const [expanded, setExpanded] = useState<number | false>(false);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['prorectorApplications'],
        queryFn: fetchProrectorApplications,
    });

    const signMutation = useMutation({
        mutationFn: (applicationId: number) => signApplication(applicationId, signatureFile),
    });

    const rejectMutation = useMutation({
        mutationFn: (applicationId: number) => rejectApplication(applicationId, 'Не правильно'),
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

    const handleReject = (applicationId: number) => {
        rejectMutation.mutate(applicationId);
    };


    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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
                    Заявления, ожидающие подписания
                </Typography>

                <div>
                    {/* Ваша форма или страница для проректора */}
                    <input type="file" onChange={handleFileChange} />
                </div>

                <SignatureField/>

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
                                    onClick={() => handleSign(application.id)}
                                    sx={{ mr: 2 }}
                                >
                                    Подписать заявление
                                </Button>
                            </Box>
                        </ApplicationAccordion>
                    </Box>
                ))}
            </Container>
        </Box>
    );
};

export default ProrectorPage;
