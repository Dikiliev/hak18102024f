import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument } from 'pdf-lib';
import saveAs from 'file-saver';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Paper,
    CircularProgress,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ClearIcon from '@mui/icons-material/Clear';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

interface PDFViewerProps {
    url: string;
    initialPage?: number;
    initialScale?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
                                                 url,
                                                 initialPage = 1,
                                                 initialScale = 1,
                                             }) => {
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [pageScale, setPageScale] = useState(initialScale);
    const [signaturePosition, setSignaturePosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const signatureRef = useRef<SignatureCanvas>(null);
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
            if (signatureRef.current) {
                signatureRef.current.clear();
            }
        }
    };

    const handlePrevious = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
            setSignaturePosition(null);
            if (signatureRef.current) {
                signatureRef.current.clear();
            }
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
        if (
            !pdfBytes ||
            !signatureRef.current ||
            !signaturePosition ||
            signatureRef.current.isEmpty()
        ) {
            alert('Пожалуйста, добавьте подпись перед сохранением.');
            return;
        }

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const page = pages[pageNumber - 1];

        const signatureDataURL = signatureRef.current.toDataURL('image/png');
        const signatureImageBytes = await fetch(signatureDataURL).then((res) =>
            res.arrayBuffer()
        );
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

        const { width, height } = page.getSize();
        const pdfScale = width / (pageDimensions?.width || width);

        const signatureWidth = (150 / (pageDimensions?.width || 1)) * width;
        const signatureHeight = (50 / (pageDimensions?.height || 1)) * height;

        const x = signaturePosition.x * pdfScale;
        const y = height - signaturePosition.y * pdfScale - signatureHeight;

        page.drawImage(signatureImage, {
            x: x,
            y: y,
            width: signatureWidth,
            height: signatureHeight,
        });

        const pdfBytesModified = await pdfDoc.save();
        const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
        saveAs(blob, 'signed_document.pdf');
    };

    const handleClearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setSignaturePosition(null);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    Просмотр и подписание PDF
                </Typography>
            </Paper>

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

                    {signaturePosition && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: signaturePosition.y * pageScale,
                                left: signaturePosition.x * pageScale,
                                border: '2px solid #3f51b5',
                                borderRadius: '4px',
                                width: `${150 * pageScale}px`,
                                height: `${50 * pageScale}px`,
                                zIndex: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{
                                    width: 150,
                                    height: 50,
                                    className: 'sigCanvas',
                                }}
                                ref={signatureRef}
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
    );
};

export default PDFViewer;
