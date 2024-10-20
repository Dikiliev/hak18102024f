import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Avatar, CircularProgress, Alert, Container, Paper } from '@mui/material';
import { useUser } from '@hooks/useUser';
import FlexBox from '@components/flexBox/FlexBox';
import SignatureCanvas from 'react-signature-canvas'; // Подключаем библиотеку для создания подписи

export interface FormData {
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    avatar: File | string | null;
    avatarPreview: string | null;
    signature: string | null;  // Добавляем поле для подписи
}

const ProfilePage: React.FC = () => {
    const { user, updateUser, error, isUpdating } = useUser();
    const signatureRef = useRef<SignatureCanvas>(null);  // Реф для холста с подписью
    const [formData, setFormData] = useState<FormData>({
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        avatar: null,
        avatarPreview: null,
        signature: null,  // Поле для подписи
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                avatar: user.avatar || null,
                avatarPreview: (typeof user.avatar == 'string' && user.avatar) || null,
                signature: user.signature || null,  // Загружаем подпись, если она есть
            });

            // Если у пользователя уже есть сохраненная подпись, загружаем ее на холст
            if (signatureRef.current && user.signature) {
                signatureRef.current.fromDataURL(user.signature);
            }
        }
    }, [user]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, avatar: file, avatarPreview: fileURL }));
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user?.username || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone_number: user?.phone_number || '',
            avatar: user?.avatar || null,
            avatarPreview: (typeof user?.avatar == 'string' && user.avatar) || null,
            signature: user?.signature || null,  // Восстанавливаем подпись
        });

        // Очищаем подпись на холсте, если была отмена изменений
        if (signatureRef.current && user?.signature) {
            signatureRef.current.fromDataURL(user.signature);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Получаем данные подписи с холста
        let signatureDataURL = formData.signature;
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            signatureDataURL = signatureRef.current.toDataURL('image/png');
        }

        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('phone_number', formData.phone_number);
        if (formData.avatar instanceof File) {
            formDataToSend.append('avatar', formData.avatar);
        }
        if (signatureDataURL) {
            formDataToSend.append('signature', signatureDataURL);  // Добавляем подпись в FormData
        }

        await updateUser(formDataToSend);
        if (formData.avatarPreview && formData.avatar instanceof File) {
            URL.revokeObjectURL(formData.avatarPreview); // Очищаем временный URL
        }
    };

    // Очистка поля подписи
    const clearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper component="form" onSubmit={handleSubmit} sx={{ margin: 'auto', p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Профиль
                </Typography>
                {error && <Alert severity="error">{error.message}</Alert>}
                <FlexBox flexDirection={'column'} gap={1}>
                    <Avatar src={(formData.avatarPreview as string) || ''} sx={{ width: 128, height: 128 }} />
                    <label htmlFor="icon-button-file">
                        <Button color="primary" size="small" component="span">
                            Загрузить новое фото
                        </Button>
                        <input type="file" id="icon-button-file" style={{ display: 'none' }} onChange={handleAvatarChange} accept="image/*" />
                    </label>
                </FlexBox>
                <TextField name="username" label="Имя пользователя" fullWidth margin="normal" value={formData.username} onChange={handleChange} />
                <TextField name="first_name" label="Имя" fullWidth margin="normal" value={formData.first_name} onChange={handleChange} />
                <TextField name="last_name" label="Фамилия" fullWidth margin="normal" value={formData.last_name} onChange={handleChange} />
                <TextField name="phone_number" label="Номер телефона" fullWidth margin="normal" value={formData.phone_number} onChange={handleChange} />

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Подпись
                    </Typography>
                    <Box
                        sx={{
                            border: '1px solid #000',
                            borderRadius: 1,
                            backgroundColor: '#fff',
                            width: '500px',
                            height: '200px',
                            mb: 1,
                            overflow: 'hidden',  // Обрезаем содержимое по краям
                        }}
                    >
                        <SignatureCanvas
                            penColor="black"
                            canvasProps={{
                                width: 500,
                                height: 200,
                                className: 'sigCanvas',
                            }}
                            ref={signatureRef}
                        />
                    </Box>
                    <Button variant="text" color="error" onClick={clearSignature}>
                        Очистить подпись
                    </Button>
                </Box>

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={isUpdating}>
                    {isUpdating ? <CircularProgress size={24} /> : 'Сохранить изменения'}
                </Button>

                <Button variant="text" color="error" fullWidth sx={{ mt: 1 }} onClick={handleCancel} disabled={isUpdating}>
                    Отменить
                </Button>
            </Paper>
        </Container>
    );
};

export default ProfilePage;
