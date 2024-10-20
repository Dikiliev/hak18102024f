import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PDFViewer from './PdfViewer';

interface PDFViewerModalProps {
    url: string;
    signatureImageUrl: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
                                                           url,
                                                           signatureImageUrl,
                                                       }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
        Открыть документ для подписи
    </Button>

    <Modal open={open} onClose={handleClose}>
    <Box
        sx={{
        position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(80%, 800px)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            px: 4,
            py: 3,
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 1
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
    initialPage={1}
    initialScale={1}
    />
    </Box>
    </Modal>
    </>
);
};

export default PDFViewerModal;
