import React, {useState} from "react";

import PDFViewer from '../components/PdfViewer.tsx';
import { useUser } from '../hooks/useUser.ts';
import { CircularProgress } from '@mui/material';


const TestPage = () => {
    const { user } = useUser()
    const userSignatureUrl = user?.signature;

    if (!userSignatureUrl) {
        return <CircularProgress />;
    }

    return (
        <div className="App">
            <PDFViewer url={'/sample.pdf'} signatureImageUrl={userSignatureUrl} initialPage={1} initialScale={1} />
        </div>
    );
};

export default TestPage;
