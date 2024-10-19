import React, { useEffect, useRef, useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import SignaturePad from 'signature_pad';
import { useTheme } from '@mui/material/styles';

// Настройка PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfSignatureModalProps {
    open: boolean;
    handleClose: () => void;
    pdfDocument: File;
}

const PdfSignatureModal: React.FC<PdfSignatureModalProps> = ({ open, handleClose, pdfDocument }) => {
    const theme = useTheme();
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const signaturePadRef = useRef<HTMLCanvasElement | null>(null);
    const signaturePad = useRef<SignaturePad | null>(null);

    // Инициализация холста для подписи
    useEffect(() => {
        if (signaturePadRef.current) {
            signaturePad.current = new SignaturePad(signaturePadRef.current);
        }
    }, []);

    // Обработка загрузки документа
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    // Обработка смены страницы
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Сохранение подписи
    const saveSignature = () => {
        if (signaturePad.current && !signaturePad.current.isEmpty()) {
            const signature = signaturePad.current.toDataURL('image/png');
            console.log('Подпись:', signature);
            // Здесь можно отправить изображение подписи на сервер
        } else {
            console.log('Подпись отсутствует');
        }
    };

    // Очистка подписи
    const clearSignature = () => {
        signaturePad.current?.clear();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    bgcolor: theme.palette.background.paper,
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
                    Подпишите документ
                </Typography>

                {/* PDF Viewer */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Document file={pdfDocument} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={currentPage} />
                    </Document>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                            Назад
                        </Button>
                        <Typography sx={{ mx: 2 }}>
                            Страница {currentPage} из {numPages}
                        </Typography>
                        <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === numPages}>
                            Вперед
                        </Button>
                    </Box>
                </Box>

                {/* Signature Pad */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Добавьте подпись
                    </Typography>
                    <canvas
                        ref={signaturePadRef}
                        style={{
                            border: '1px solid black',
                            borderRadius: '5px',
                            width: '100%',
                            height: '200px',
                        }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={clearSignature} sx={{ mr: 2 }}>
                            Очистить
                        </Button>
                        <Button variant="contained" color="primary" onClick={saveSignature}>
                            Сохранить подпись
                        </Button>
                    </Box>
                </Box>

                {/* Закрыть модальное окно */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PdfSignatureModal;
