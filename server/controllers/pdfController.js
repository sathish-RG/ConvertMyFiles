const { PDFDocument, degrees } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');

class PDFController {
  async compressPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      const inputPath = req.file.path;
      const outputPath = path.join(path.dirname(inputPath), `compressed-${req.file.filename}`);

      // Read the PDF
      const existingPdfBytes = await fs.readFile(inputPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Basic compression by removing unnecessary elements
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false
      });

      await fs.writeFile(outputPath, pdfBytes);

      // Send the compressed file
      res.download(outputPath, `compressed-${req.file.originalname}`, async (err) => {
        if (err) console.error('Download error:', err);
        
        // Clean up files
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });

    } catch (error) {
      console.error('PDF compression error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compress PDF'
      });
    }
  }

  async splitPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      const { startPage = 1, endPage } = req.body;
      const inputPath = req.file.path;

      const existingPdfBytes = await fs.readFile(inputPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      const totalPages = pdfDoc.getPageCount();
      const end = endPage ? parseInt(endPage) : totalPages;
      const start = parseInt(startPage);

      if (start < 1 || end > totalPages || start > end) {
        await fs.remove(inputPath);
        return res.status(400).json({
          success: false,
          message: 'Invalid page range'
        });
      }

      // Create new PDF with selected pages
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, Array.from(
        { length: end - start + 1 }, 
        (_, i) => start - 1 + i
      ));

      pages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const outputPath = path.join(path.dirname(inputPath), `split-${req.file.filename}`);
      
      await fs.writeFile(outputPath, pdfBytes);

      res.download(outputPath, `split-${req.file.originalname}`, async (err) => {
        if (err) console.error('Download error:', err);
        
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });

    } catch (error) {
      console.error('PDF split error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to split PDF'
      });
    }
  }

  async rotatePDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      const { rotation = 90 } = req.body;
      const inputPath = req.file.path;

      const existingPdfBytes = await fs.readFile(inputPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      const pages = pdfDoc.getPages();
      const rotationAngle = parseInt(rotation);

      pages.forEach(page => {
        page.setRotation(degrees(rotationAngle));
      });

      const pdfBytes = await pdfDoc.save();
      const outputPath = path.join(path.dirname(inputPath), `rotated-${req.file.filename}`);
      
      await fs.writeFile(outputPath, pdfBytes);

      res.download(outputPath, `rotated-${req.file.originalname}`, async (err) => {
        if (err) console.error('Download error:', err);
        
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });

    } catch (error) {
      console.error('PDF rotation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to rotate PDF'
      });
    }
  }

  async pdfToWord(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      // Note: This is a simplified implementation
      // For production, you'd want to use a more sophisticated PDF to Word converter
      const inputPath = req.file.path;
      
      res.status(200).json({
        success: true,
        message: 'PDF to Word conversion is not fully implemented in this demo. Please use a dedicated service.',
        note: 'This would require additional libraries like pdf2doc or external services.'
      });

      await fs.remove(inputPath);

    } catch (error) {
      console.error('PDF to Word error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to convert PDF to Word'
      });
    }
  }
}

module.exports = new PDFController();