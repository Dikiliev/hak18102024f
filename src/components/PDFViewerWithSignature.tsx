import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Modal, Box, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Устанавливаем путь к PDF worker вручную
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface PDFViewerProps {
    file: string; // Путь или URL к PDF-документу
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
    const [open, setOpen] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Открыть PDF
            </Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="pdf-viewer-modal">
                <Box sx={modalStyle}>
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <div>
                        <Button
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                            disabled={pageNumber <= 1}
                        >
                            Назад
                        </Button>
                        <Button
                            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                            disabled={pageNumber >= (numPages || 1)}
                        >
                            Вперед
                        </Button>
                    </div>
                    <p>
                        Страница {pageNumber} из {numPages}
                    </p>
                </Box>
            </Modal>
        </>
    );
};

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '80%',
    overflow: 'auto',
};

export default PDFViewer;
