import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {Container, Grid, Typography, TextField, Button, CircularProgress, Alert, Box, Paper} from '@mui/material';
import { fetchApplicationType, submitApplication } from '@api/applications';
import { useParams, useNavigate } from 'react-router-dom';

interface ApplicationField {
    id: number;
    name: string;
    field_type: string;
    is_required: boolean;
    template?: string;
}

interface ApplicationType {
    id: number;
    name: string;
    description: string;
    fields: ApplicationField[];
}

const SubmitApplicationForm: React.FC = () => {
    const { typeId } = useParams<{ typeId: string }>();
    const id = typeId ? parseInt(typeId, 10) : null;

    const navigate = useNavigate();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [fileData, setFileData] = useState<{ [key: string]: File }>({});

    // Fetching application type and fields
    const { data, isLoading, isError, error } = useQuery<ApplicationType, Error>({
        queryKey: ['applicationType', id],
        queryFn: () => fetchApplicationType(id),
        enabled: !!id,
    });

    // Mutation for submitting the application
    const mutation = useMutation({
        mutationFn: (formData: FormData) => submitApplication(formData),
        onSuccess: () => {
            navigate('/profile');
        },
    });

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Загрузка полей для заполнения заявления...</Typography>
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

    const handleInputChange = (fieldId: number, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldId]: value,
        }));
    };

    const handleFileChange = (fieldId: number, file: File) => {
        setFileData((prevData) => ({
            ...prevData,
            [fieldId]: file,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formSubmissionData = new FormData();
        formSubmissionData.append('application_type', typeId!);  // Передача типа заявления

        // Предположим, у нас есть поля с осмысленными ключами вместо чисел
        formSubmissionData.append('first_name', formData['1']);  // Здесь '1' - идентификатор поля ФИО
        formSubmissionData.append('faculty', formData['2']);     // Здесь '2' - идентификатор поля факультета
        formSubmissionData.append('course', formData['3']);      // Здесь '3' - идентификатор поля курса
        formSubmissionData.append('reason', formData['4']);      // Здесь '4' - идентификатор поля причины

        mutation.mutate(formSubmissionData);
    };


    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Заполните заявление
                </Typography>

                <Box component={'form'} onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {data?.fields.map((field) => (
                            <Grid item xs={12} key={field.id}>
                                {field.field_type === 'text' && (
                                    <TextField
                                        label={field.name}
                                        fullWidth
                                        required={field.is_required}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                )}

                                {field.field_type === 'document' && (
                                    <>
                                        <Typography variant="body1">{field.name} (PDF, DOC)</Typography>
                                        {field.template && (
                                            <Button variant="outlined" href={field.template} target="_blank" sx={{ mb: 2 }}>
                                                Скачать шаблон
                                            </Button>
                                        )}
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(field.id, e.target.files![0])}
                                        />
                                    </>
                                )}

                                {field.field_type === 'image' && (
                                    <>
                                        <Typography variant="body1">{field.name} (JPG, PNG)</Typography>
                                        <input
                                            type="file"
                                            accept=".jpg,.png"
                                            onChange={(e) => handleFileChange(field.id, e.target.files![0])}
                                        />
                                    </>
                                )}

                                {field.field_type === 'signature' && (
                                    <>
                                        <Typography variant="body1">{field.name} (Загрузить подпись)</Typography>
                                        <input
                                            type="file"
                                            accept=".jpg,.png"
                                            onChange={(e) => handleFileChange(field.id, e.target.files![0])}
                                        />
                                    </>
                                )}
                            </Grid>
                        ))}
                    </Grid>

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={mutation.isPending}
                        sx={{ mt: 4 }}
                    >
                        {mutation.isPending ? 'Отправка...' : 'Отправить заявление'}
                    </Button>
                </Box>

                {mutation.isError && <Alert severity="error">Ошибка при отправке заявления: {mutation.error.message}</Alert>}
            </Paper>
        </Container>
    );
};

export default SubmitApplicationForm;
