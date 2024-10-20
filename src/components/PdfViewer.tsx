import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./../../styles.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

interface PDFViewerProps {
    url: string;
    initialPage?: number;
    initialScale?: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
                                                        url,
                                                        initialPage = 1,
                                                        initialScale = 1,
                                                    }) => {
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(initialPage);
    const [pageScale, setPageScale] = useState(initialScale);

    const onDocumentLoadSuccess = ({ numPages }: any) => {
        setTotalPages(numPages);
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
        }
    };

    const handlePrevious = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    return (
        <div className="pdf-viewer">
            <div className="page-container">
                <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} scale={pageScale} />
                </Document>
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
            </div>
        </div>
    );
};

export default PDFViewer;
