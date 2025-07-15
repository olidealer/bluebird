
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useTaxData } from '../../hooks/useTaxData';
import { parseInvoiceXML } from '../../services/xmlParser';

interface InvoiceUploaderProps {
  yearMonth: string;
}

export const InvoiceUploader: React.FC<InvoiceUploaderProps> = ({ yearMonth }) => {
  const { addExpense } = useTaxData();
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const onDrop = useCallback(<T extends File,>(acceptedFiles: T[]) => {
    setFeedback(null);
    let successCount = 0;
    let errorCount = 0;

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        const parsedData = parseInvoiceXML(fileContent);
        if (parsedData) {
          addExpense(yearMonth, { ...parsedData, category: 'Sin categoría' });
          successCount++;
        } else {
          console.error(`Error parsing file: ${file.name}`);
          errorCount++;
        }
        
        if (successCount + errorCount === acceptedFiles.length) {
            setFeedback({
                message: `Carga completa. ${successCount} facturas agregadas, ${errorCount} fallaron.`,
                type: errorCount > 0 ? 'error' : 'success'
            });
        }
      };
      reader.readAsText(file);
    });
  }, [yearMonth, addExpense]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/xml': ['.xml'], 'text/xml': ['.xml'] },
  });

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
          ${isDragActive ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-300 hover:border-brand-primary hover:bg-brand-primary/5'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2 text-lg font-semibold text-brand-primary">Suelta los archivos aquí...</p>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold text-gray-700">Arrastra y suelta tus facturas XML</p>
            <p className="text-sm text-gray-500">o haz clic para seleccionarlas</p>
          </>
        )}
      </div>
      {feedback && (
        <div className={`mt-4 p-3 rounded-md flex items-center text-sm ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {feedback.type === 'success' ? <CheckCircle size={20} className="mr-2"/> : <XCircle size={20} className="mr-2"/>}
            {feedback.message}
        </div>
      )}
    </div>
  );
};
