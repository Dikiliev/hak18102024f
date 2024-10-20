import React, {useState} from "react";

import PDFViewer from '../components/PdfViewer.tsx';


const TestPage = () => {
    return (
        <div className="App">
            <PDFViewer url={'/sample.pdf'} initialPage={1} initialScale={1} />
        </div>
    );
};

export default TestPage;
