import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Box } from '@mui/material';
import { useUser } from './../hooks/useUser'; // Хук для работы с пользователем

const SignatureFieldWithSave: React.FC = () => {
    const { user, updateUser, isUpdating } = useUser();
    const signatureRef = useRef<SignatureCanvas>(null);

    // Устанавливаем подпись при загрузке
    React.useEffect(() => {
        if (signature && signatureRef.current) {
            signatureRef.current.fromDataURL(signature);
        }
    }, [signature]);

    // Сохранение подписи
    const saveSignature = () => {
        if (signatureRef.current) {
            const signatureDataURL = signatureRef.current.toDataURL('image/png');
            updateSignature(signatureDataURL); // Сохранение подписи

            updateUser()
        }
    };

    if (isLoadingSignature) {
        return <div>Загрузка подписи...</div>;
    }

    return (
        <Box>
            <Box
                sx={{
                    border: '1px solid #000',
                    width: '400px',
                    height: '200px',
                    marginBottom: '16px',
                }}
            >
                <SignatureCanvas
                    penColor="black"
                    canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
                    ref={signatureRef}
                />
            </Box>
            <Button variant="contained" onClick={saveSignature} disabled={isUpdating}>
                {isUpdating ? 'Сохранение...' : 'Сохранить подпись'}
            </Button>
        </Box>
    );
};

export default SignatureFieldWithSave;
