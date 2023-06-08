import React, { ChangeEvent, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface AppState {
  numPages: number;
  pdfText: string;
}

const App: React.FC = () => {
  const [numPages, setNumPages] = useState(0);
  const [pdfText, setPdfText] = useState('');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjs.getDocument(uint8Array);

        try {
          const pdf = await loadingTask.promise;
          let pdfText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.string).join(' ');
            pdfText += pageText + '\n';
          }

          setNumPages(pdf.numPages);
          setPdfText(pdfText);
          console.log('PDF Text:', pdfText);
        } catch (error) {
          console.log('Error occurred while parsing PDF:', error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <h1>PDF Reader</h1>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />

      {numPages > 0 && (
        <div>
          <p>Number of Pages: {numPages}</p>
          <pre>{pdfText}</pre>

          <Document file={null}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default App;
