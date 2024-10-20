import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import './../../styles.css';

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
    const [signaturePosition, setSignaturePosition] = useState<{ x: number; y: number } | null>(null);
    const signatureRef = useRef<SignatureCanvas>(null);
    const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
    const viewerRef = useRef<HTMLDivElement | null>(null);
    const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        const loadPdf = async () => {
            const response = await fetch(url);
            const pdfBytes = await response.arrayBuffer();
            setPdfBytes(pdfBytes);
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
        const x = (event.clientX - containerRect.left + viewerRef.current.scrollLeft) / pageScale;
        const y = (event.clientY - containerRect.top + viewerRef.current.scrollTop) / pageScale;

        setSignaturePosition({ x, y });
    };

    const handleDownloadSignedPDF = async () => {
        if (!pdfBytes || !signatureRef.current || !signaturePosition || signatureRef.current.isEmpty()) {
            alert('Пожалуйста, добавьте подпись перед сохранением.');
            return;
        }

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const page = pages[pageNumber - 1];

        const signatureDataURL = signatureRef.current.toDataURL('image/png');
        const signatureImageBytes = await fetch(signatureDataURL).then((res) => res.arrayBuffer());
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
        <div className="pdf-viewer">
            <div
                ref={viewerRef}
                onClick={handlePageClick}
                style={{ position: 'relative', display: 'inline-block' }}
            >
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div>Загрузка документа...</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={pageScale}
                        onLoadSuccess={onPageLoadSuccess}
                        renderTextLayer={false}       // Disable text layer
                        renderAnnotationLayer={false} // Disable annotation layer
                    />
                </Document>

                {signaturePosition && (
                    <div
                        style={{
                            position: 'absolute',
                            top: signaturePosition.y * pageScale,
                            left: signaturePosition.x * pageScale,
                            border: '1px solid black',
                            width: `${150 * pageScale}px`,
                            height: `${50 * pageScale}px`,
                            zIndex: 1,
                        }}
                    >
                        <SignatureCanvas
                            penColor="black"
                            canvasProps={{ width: 150, height: 50, className: 'sigCanvas' }}
                            ref={signatureRef}
                        />
                    </div>
                )}
            </div>

            <div className="footer">
                <div className="button-container">
                    <button onClick={handleZoomIn} disabled={pageScale >= 3}>
                        Zoom +
                    </button>
                    <button onClick={handleZoomOut} disabled={pageScale <= 0.3}>
                        Zoom -
                    </button>
                </div>
                <div className="page-text">
                    Page {pageNumber} of {totalPages}
                </div>
                <div className="button-container">
                    <button onClick={handlePrevious} disabled={pageNumber === 1}>
                        ‹ Previous
                    </button>
                    <button onClick={handleNext} disabled={pageNumber === totalPages}>
                        Next ›
                    </button>
                </div>

                <div className="signature-actions">
                    <button onClick={handleDownloadSignedPDF}>Скачать с подписью</button>
                    <button onClick={handleClearSignature}>Очистить подпись</button>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
