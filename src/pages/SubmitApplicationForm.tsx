import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Container, Grid, Typography, Button, CircularProgress, Alert, Box, Paper, TextField } from '@mui/material';
import { fetchApplicationType, submitApplication } from '../api/applications';
import { useParams, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Иконка загрузки
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Иконка успешной загрузки

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
    const [filePreview, setFilePreview] = useState<{ [key: string]: string }>({}); // Для превью выбранных файлов

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
            navigate('/success');
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

    const handleInputChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (name: string, file: File) => {
        setFileData((prevData) => ({
            ...prevData,
            [name]: file,
        }));
        setFilePreview((prevPreview) => ({
            ...prevPreview,
            [name]: file.name, // Отображаем имя файла после выбора
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formSubmissionData = new FormData();

        // Присваиваем тип заявления
        formSubmissionData.append('application_type', typeId!);

        // Поля текстовых данных. Упаковываем их в JSON перед добавлением
        const fieldsData = {
            ...formData,
        };
        formSubmissionData.append('fields_data', JSON.stringify(fieldsData));

        // Добавляем файлы (документы, подписи и т.д.)
        Object.keys(fileData).forEach((key) => {
            formSubmissionData.append(key, fileData[key]);
        });

        // Отправляем запрос через React Query
        mutation.mutate(formSubmissionData);
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Заполните заявление
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {data?.fields.map((field) => (
                            <Grid item xs={12} key={field.id}>
                                {field.field_type === 'text' && (
                                    <TextField
                                        label={field.name}
                                        fullWidth
                                        required={field.is_required}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    />
                                )}

                                {(field.field_type === 'document' || field.field_type === 'image' || field.field_type === 'signature') && (
                                    <>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {field.name}
                                        </Typography>
                                        {field.template && (
                                            <Button variant="outlined" href={field.template} target="_blank" sx={{ mb: 2 }}>
                                                Скачать шаблон
                                            </Button>
                                        )}

                                        <label htmlFor={`file-input-${field.id}`}>
                                            <input
                                                style={{ display: 'none' }}
                                                id={`file-input-${field.id}`}
                                                type="file"
                                                accept={field.field_type === 'document' ? '.pdf,.doc,.docx' : '.jpg,.png'}
                                                onChange={(e) => handleFileChange(field.name, e.target.files![0])}
                                            />
                                            <Button
                                                component="span"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CloudUploadIcon />}
                                                fullWidth
                                                sx={{ mb: 2 }}
                                            >
                                                {filePreview[field.name] ? 'Файл выбран' : 'Загрузить файл'}
                                            </Button>
                                        </label>

                                        {/* Отображение имени файла после выбора */}
                                        {filePreview[field.name] && (
                                            <Typography variant="body2" color="textSecondary">
                                                <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                                {filePreview[field.name]}
                                            </Typography>
                                        )}
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
