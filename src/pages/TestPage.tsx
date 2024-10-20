import React, {useState} from "react";

import PdfViewer, { PDFViewer } from '../components/PdfViewer.tsx';


const TestPage = () => {
    const pdfUrl =
        "https://cors-anywhere.herokuapp.com/https://ncu.rcnpv.com.tw/Uploads/20131231103232738561744.pdf";

    return (
        <div className="App">
            <PDFViewer url={'/sample.pdf'} initialPage={1} initialScale={1} />
        </div>
    );
};

export default TestPage;
