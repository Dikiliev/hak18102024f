import React from 'react';
import {
    Modal,
    Box,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PDFViewer from './PdfViewer';

interface PDFViewerModalProps {
    isOpen: boolean;
    setClose: (value: boolean) => void;
    url: string;
    signatureImageUrl: string;
    applicationId: number; // Новый проп
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ isOpen, setClose, url, signatureImageUrl, applicationId }) => {
    const handleClose = () => {
        setClose(false);
    };

    const handleSent = () => {
        handleClose();
    }

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(80%, 900px)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    px: 4,
                    py: 3,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" textAlign={'center'} width={'100%'}>Подписание документа</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <PDFViewer
                    url={url}
                    signatureImageUrl={signatureImageUrl}
                    applicationId={applicationId} // Передаем applicationId
                    initialPage={1}
                    initialScale={1}
                    onSent={handleSent}
                />
            </Box>
        </Modal>
    );
};

export default PDFViewerModal;
