import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {Button, Box, Input, Paper, Typography} from '@mui/material';
import { useUser } from './../hooks/useUser'; // Хук для работы с пользователем

export interface FormData {
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    avatar: File | string | null;
    avatarPreview: string | null;
    signature: string | null;
}

const SignatureFieldWithSave: React.FC = () => {
    const { user, updateUser, isUpdating, isLoadingUser } = useUser();
    const signatureRef = useRef<SignatureCanvas>(null);

    const [formData, setFormData] = useState<FormData>({
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        avatar: null,
        avatarPreview: null,
        signature: null,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                avatar: user.avatar || null,
                signature: user.signature || null,
                avatarPreview: (typeof user.avatar == 'string' && user.avatar) || null,
            });
        }
    }, [user]);

    // Устанавливаем подпись при загрузке
    useEffect(() => {
        if (signatureRef.current && user?.signature) {
            signatureRef.current.fromDataURL(user.signature);
        }
    }, [user]);

    // Очистка поля подписи
    const clearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
        }
    };

    // Сохранение подписи и обновление профиля
    const saveSignature = async () => {
        if (signatureRef.current) {
            const signatureDataURL = signatureRef.current.toDataURL('image/png');
            const updatedFormData = {
                ...formData,
                signature: signatureDataURL,
            };

            const formDataToSend = new FormData();
            Object.entries(updatedFormData).forEach(([key, value]) => {
                if (value !== null && key !== 'avatarPreview') {
                    formDataToSend.append(key, value);
                }
            });

            await updateUser(formDataToSend);
            if (formData.avatarPreview && formData.avatar instanceof File) {
                URL.revokeObjectURL(formData.avatarPreview);
            }
        }
    };

    // Сохранение изображения подписи как файла на компьютер
    const saveSignatureAsImage = () => {
        if (signatureRef.current) {
            const signatureDataURL = signatureRef.current.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = signatureDataURL;
            a.download = 'signature.png';
            a.click();
        }
    };

    // Загрузка подписи с картинки
    const loadSignatureFromImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && signatureRef.current) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataURL = e.target?.result as string;
                signatureRef.current.fromDataURL(dataURL); // Устанавливаем изображение на холст
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoadingUser) {
        return <div>Загрузка подписи...</div>;
    }

    return (
        <Paper sx={{ p: 4, pb: 2}} >
            <Typography variant={'h5'} sx={{ mb: 2 }}>Ваша подпись</Typography>
            <Box display="flex" justifyContent="" alignItems="flex-start" gap={2}>
                <Box
                    sx={{
                        border: '1px solid #000',
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        width: '400px',
                        height: '200px',
                        mb: 1,
                        overflow: 'hidden', // Обрезаем содержимое по краям
                    }}
                >
                    <SignatureCanvas
                        penColor="black"
                        canvasProps={{
                            width: 400,
                            height: 200,
                            className: 'sigCanvas',
                            style: { backgroundColor: '#fff' },
                        }}
                        ref={signatureRef}
                    />
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                    <Button variant="contained" onClick={saveSignature} disabled={isUpdating}>
                        {isUpdating ? 'Сохранение...' : 'Сохранить подпись'}
                    </Button>
                    <Button variant="outlined" color={'error'} onClick={clearSignature}>
                        Очистить подпись
                    </Button>
                    {/*<Button variant="contained" color="secondary" onClick={saveSignatureAsImage}>*/}
                    {/*    Сохранить как изображение*/}
                    {/*</Button>*/}

                </Box>
            </Box>

            <Input
                type="file"
                accept="image/*"
                onChange={loadSignatureFromImage}
                inputProps={{ style: { display: 'none'} }}
                id="upload-signature"
                sx={{ display: 'none'}}
            />
            <label htmlFor="upload-signature">
                <Button variant="text" component="span">
                    Загрузить с картинки
                </Button>
            </label>

        </Paper>
    );
};

export default SignatureFieldWithSave;
