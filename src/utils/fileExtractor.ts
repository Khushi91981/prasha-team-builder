import * as mammoth from 'mammoth';

// Extract text from DOCX
export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

// Extract text from PDF using PDF.js
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Set worker source to CDN or local fallback
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.warn('PDF text extraction error, falling back to text read:', error);
    // Fallback attempt: read as text for text-based PDF/file
    try {
      const text = await file.text();
      // Clean readable ASCII
      const clean = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      if (clean.length > 100) return clean;
    } catch {
      // ignore
    }
    throw new Error('Unable to extract text from PDF. Please use the Paste Resume Text option if your PDF is scanned or password-protected.');
  }
}

// Generic file extractor dispatcher
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'docx') {
    return await extractTextFromDocx(file);
  } else if (ext === 'pdf') {
    return await extractTextFromPdf(file);
  } else if (ext === 'txt' || ext === 'doc') {
    return await file.text();
  } else {
    return await file.text();
  }
}
