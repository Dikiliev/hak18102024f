import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Paper,
    CircularProgress,
    Slider,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { apiInstance } from '../api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
    url: string;
    signatureImageUrl: string;
    applicationId: number; // Новый проп для идентификатора заявления
    initialPage?: number;
    initialScale?: number;
    onSent?: void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
                                                 url,
                                                 signatureImageUrl,
                                                 applicationId, // Используем applicationId
                                                 initialPage = 1,
                                                 initialScale = 1,
                                                 onSent
                                             }) => {
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [pageScale, setPageScale] = useState(initialScale);
    const [signaturePosition, setSignaturePosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [signatureImage, setSignatureImage] = useState<HTMLImageElement | null>(null);
    const [signatureScale, setSignatureScale] = useState<number>(0.5);
    const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
    const viewerRef = useRef<HTMLDivElement | null>(null);
    const [pageDimensions, setPageDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadPdf = async () => {
            const response = await fetch(url);
            const pdfBytes = await response.arrayBuffer();
            setPdfBytes(pdfBytes);
            setLoading(false);
        };

        loadPdf();
    }, [url]);

    useEffect(() => {
        // Загружаем изображение подписи
        const img = new Image();
        img.src = signatureImageUrl;
        img.onload = () => {
            setSignatureImage(img);
        };
    }, [signatureImageUrl]);

    const onDocumentLoadSuccess = ({ numPages }: any) => {
        setTotalPages(numPages);
    };

    const onPageLoadSuccess = (page: any) => {
        const { width, height } = page.getViewport({ scale: 1 });
        setPageDimensions({ width, height });
    };

    const handleZoomIn = () => {
        if (pageScale < 3) {
            setPageScale(pageScale + 0.2);
        }
    };

    const handleZoomOut = () => {
        if (pageScale > 0.3) {
            setPageScale(pageScale - 0.2);
        }
    };

    const handleNext = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
            setSignaturePosition(null);
        }
    };

    const handlePrevious = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
            setSignaturePosition(null);
        }
    };

    const handlePageClick = (event: React.MouseEvent) => {
        if (!viewerRef.current || !pageDimensions) return;

        const containerRect = viewerRef.current.getBoundingClientRect();
        const x =
            (event.clientX - containerRect.left + viewerRef.current.scrollLeft) /
            pageScale;
        const y =
            (event.clientY - containerRect.top + viewerRef.current.scrollTop) /
            pageScale;

        setSignaturePosition({ x, y });
    };

    const handleDownloadSignedPDF = async () => {
        if (!pdfBytes || !signaturePosition || !signatureImage) {
            alert('Пожалуйста, выберите место для подписи перед сохранением.');
            return;
        }

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const page = pages[pageNumber - 1];

        // Получаем байты изображения подписи
        const response = await fetch(signatureImageUrl);
        const signatureImageBytes = await response.arrayBuffer();
        const embeddedSignatureImage = await pdfDoc.embedPng(signatureImageBytes);

        const { width, height } = page.getSize();
        const pdfScale = width / (pageDimensions?.width || width);

        // Вычисляем размеры подписи в PDF, учитывая signatureScale
        const signatureWidth =
            (signatureImage.width / (pageDimensions?.width || 1)) * width * signatureScale;
        const signatureHeight =
            (signatureImage.height / (pageDimensions?.height || 1)) * height * signatureScale;

        // Центрируем подпись на месте клика
        const x = signaturePosition.x * pdfScale - signatureWidth / 2;
        const y = height - signaturePosition.y * pdfScale - signatureHeight / 2;

        page.drawImage(embeddedSignatureImage, {
            x: x,
            y: y,
            width: signatureWidth,
            height: signatureHeight,
        });

        const pdfBytesModified = await pdfDoc.save();
        const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
        saveAs(blob, 'signed_document.pdf');
    };

    const handleSend = () => {
        if (onSent) {
            onSent();
        }
    };

    const handleSendSignedPDF = async () => {
        if (!pdfBytes || !signaturePosition || !signatureImage) {
            alert('Пожалуйста, выберите место для подписи перед отправкой.');
            return;
        }

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const page = pages[pageNumber - 1];

        // Получаем байты изображения подписи
        const response = await fetch(signatureImageUrl);
        const signatureImageBytes = await response.arrayBuffer();
        const embeddedSignatureImage = await pdfDoc.embedPng(signatureImageBytes);

        const { width, height } = page.getSize();
        const pdfScale = width / (pageDimensions?.width || width);

        // Вычисляем размеры подписи в PDF, учитывая signatureScale
        const signatureWidth =
            (signatureImage.width / (pageDimensions?.width || 1)) * width * signatureScale;
        const signatureHeight =
            (signatureImage.height / (pageDimensions?.height || 1)) * height * signatureScale;

        // Центрируем подпись на месте клика
        const x = signaturePosition.x * pdfScale - signatureWidth / 2;
        const y = height - signaturePosition.y * pdfScale - signatureHeight / 2;

        page.drawImage(embeddedSignatureImage, {
            x: x,
            y: y,
            width: signatureWidth,
            height: signatureHeight,
        });

        const pdfBytesModified = await pdfDoc.save();

        // Отправляем подписанный PDF на сервер
        const formData = new FormData();
        formData.append('ready_document', new Blob([pdfBytesModified], { type: 'application/pdf' }));

        try {
            await apiInstance.post(`/applications/list/${applicationId}/complete/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Документ успешно отправлен.');
            handleSend();

        } catch (error) {
            console.error('Ошибка при отправке документа:', error);
            alert('Произошла ошибка при отправке документа.');
        }
    };

    const handleClearSignature = () => {
        setSignaturePosition(null);
    };

    const handleSignatureScaleChange = (event: Event, newValue: number | number[]) => {
        setSignatureScale(newValue as number);
    };

    return (
        <Box sx={{ p: 3 }}>
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    ref={viewerRef}
                    onClick={handlePageClick}
                    sx={{
                        position: 'relative',
                        display: 'inline-block',
                        mb: 2,
                        border: '1px solid #ccc',
                    }}
                >
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '400px',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={pageScale}
                            onLoadSuccess={onPageLoadSuccess}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>

                    {signaturePosition && signatureImage && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top:
                                    signaturePosition.y * pageScale -
                                    (signatureImage.height * pageScale * signatureScale) / 2,
                                left:
                                    signaturePosition.x * pageScale -
                                    (signatureImage.width * pageScale * signatureScale) / 2,
                                width: `${signatureImage.width * pageScale * signatureScale}px`,
                                height: `${signatureImage.height * pageScale * signatureScale}px`,
                                zIndex: 1,
                            }}
                        >
                            <img
                                src={signatureImageUrl}
                                alt="Подпись"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Box>
                    )}
                </Box>
            )}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handlePrevious} disabled={pageNumber === 1}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <Typography variant="body1">
                        Страница {pageNumber} из {totalPages}
                    </Typography>
                    <IconButton
                        onClick={handleNext}
                        disabled={pageNumber === totalPages}
                    >
                        <NavigateNextIcon />
                    </IconButton>
                </Box>

                <Box>
                    <IconButton onClick={handleZoomIn} disabled={pageScale >= 3}>
                        <ZoomInIcon />
                    </IconButton>
                    <IconButton onClick={handleZoomOut} disabled={pageScale <= 0.3}>
                        <ZoomOutIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Контролы для изменения размера подписи */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography variant="body1" sx={{ mr: 2 }}>
                    Размер подписи:
                </Typography>
                <Slider
                    value={signatureScale}
                    onChange={handleSignatureScaleChange}
                    min={0.1}
                    max={2}
                    step={0.1}
                    sx={{ width: 200 }}
                />
                <Typography variant="body2" sx={{ ml: 2 }}>
                    {Math.round(signatureScale * 100)}%
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveAltIcon />}
                    onClick={handleDownloadSignedPDF}
                >
                    Скачать с подписью
                </Button>

                <Box>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon />}
                        onClick={handleSendSignedPDF}
                        sx={{ mr: 2 }}
                    >
                        Отправить
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<ClearIcon />}
                        onClick={handleClearSignature}
                    >
                        Очистить подпись
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PDFViewer;
