// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, CircularProgress, Alert } from '@mui/material';
import { useUser } from '@hooks/useUser';
import FlexBox from '@components/flexBox/FlexBox';

interface FormData {
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    avatar: File | string | null;
    avatarPreview: string | null;
}

const ProfilePage: React.FC = () => {
    const { user, updateUser, error, isUpdating } = useUser();
    const [formData, setFormData] = useState<FormData>({
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        avatar: null,
        avatarPreview: null,
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
            });
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
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && key !== 'avatarPreview') {
                formDataToSend.append(key, value);
            }
        });

        await updateUser(formDataToSend);
        if (formData.avatarPreview && formData.avatar instanceof File) {
            URL.revokeObjectURL(formData.avatarPreview); // Очищаем временный URL
        }
    };

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 2 }}>
            <Typography variant='h5' gutterBottom>
                Профиль
            </Typography>
            {error && <Alert severity='error'>{error.message}</Alert>}
            <FlexBox flexDirection={'column'} gap={1}>
                <Avatar src={(formData.avatarPreview as string) || ''} sx={{ width: 128, height: 128 }} />
                <label htmlFor='icon-button-file'>
                    <Button color='primary' size='small' component='span'>
                        Загрузить новое фото
                    </Button>
                    <input type='file' id='icon-button-file' style={{ display: 'none' }} onChange={handleAvatarChange} accept='image/*' />
                </label>
            </FlexBox>
            <TextField name='username' label='Имя пользователя' fullWidth margin='normal' value={formData.username} onChange={handleChange} />
            <TextField name='first_name' label='Имя' fullWidth margin='normal' value={formData.first_name} onChange={handleChange} />
            <TextField name='last_name' label='Фамилия' fullWidth margin='normal' value={formData.last_name} onChange={handleChange} />
            <TextField name='phone_number' label='Номер телефона' fullWidth margin='normal' value={formData.phone_number} onChange={handleChange} />
            <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 3 }} disabled={isUpdating}>
                {isUpdating ? <CircularProgress size={24} /> : 'Сохранить изменения'}
            </Button>

            <Button variant='text' color='error' fullWidth sx={{ mt: 1 }} onClick={handleCancel} disabled={isUpdating}>
                Отменить
            </Button>
        </Box>
    );
};

export default ProfilePage;
