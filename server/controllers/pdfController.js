const { PDFDocument, degrees } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');
const PDFDocumentKit = require('pdfkit');
const archiver = require('archiver');

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

  async compressAdvancedPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      const {
        compressionLevel = 'medium',
        removeImages = false,
        removeFonts = false,
        removeMetadata = false,
        optimizeForWeb = false
      } = req.body;

      const inputPath = req.file.path;
      const outputPath = path.join(path.dirname(inputPath), `compressed-${req.file.filename}`);

      // Read the PDF
      const existingPdfBytes = await fs.readFile(inputPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Apply advanced compression options
      let compressionOptions = {
        useObjectStreams: false,
        addDefaultPage: false
      };

      // Set compression level
      switch (compressionLevel) {
        case 'low':
          compressionOptions = { ...compressionOptions, objectsPerTick: 50, updateFieldAppearances: false };
          break;
        case 'high':
          compressionOptions = { ...compressionOptions, objectsPerTick: 1, updateFieldAppearances: true };
          break;
        case 'extreme':
          compressionOptions = { ...compressionOptions, objectsPerTick: 1, updateFieldAppearances: true, compress: true };
          break;
        default: // medium
          compressionOptions = { ...compressionOptions, objectsPerTick: 10, updateFieldAppearances: false };
      }

      // Remove images if requested
      if (removeImages) {
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          // This is a simplified approach - in practice, you'd need more sophisticated image removal
          // For now, we'll just note that images should be removed
        }
      }

      // Remove fonts if requested (simplified)
      if (removeFonts) {
        // Font removal is complex and not directly supported by pdf-lib
        // This would require more advanced PDF manipulation
      }

      // Remove metadata if requested
      if (removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      // Optimize for web if requested
      if (optimizeForWeb) {
        compressionOptions = { ...compressionOptions, useObjectStreams: true };
      }

      const pdfBytes = await pdfDoc.save(compressionOptions);

      await fs.writeFile(outputPath, pdfBytes);

      // Send the compressed file
      res.download(outputPath, `compressed-${req.file.originalname}`, async (err) => {
        if (err) console.error('Download error:', err);
        
        // Clean up files
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });

    } catch (error) {
      console.error('Advanced PDF compression error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compress PDF'
      });
    }
  }

  async compressBatchPDFs(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No PDF files uploaded'
        });
      }

      const {
        compressionLevel = 'medium',
        removeImages = false,
        removeFonts = false,
        removeMetadata = false,
        optimizeForWeb = false,
        outputMode = 'zip'
      } = req.body;

      // Create a unique directory for this batch
      const batchId = Date.now().toString();
      const batchDir = path.join(path.dirname(req.files[0].path), `batch-pdf-${batchId}`);
      await fs.ensureDir(batchDir);

      const compressedFiles = [];
      const errors = [];

      // Compression options
      let compressionOptions = {
        useObjectStreams: false,
        addDefaultPage: false
      };

      switch (compressionLevel) {
        case 'low':
          compressionOptions = { ...compressionOptions, objectsPerTick: 50, updateFieldAppearances: false };
          break;
        case 'high':
          compressionOptions = { ...compressionOptions, objectsPerTick: 1, updateFieldAppearances: true };
          break;
        case 'extreme':
          compressionOptions = { ...compressionOptions, objectsPerTick: 1, updateFieldAppearances: true, compress: true };
          break;
        default:
          compressionOptions = { ...compressionOptions, objectsPerTick: 10, updateFieldAppearances: false };
      }

      // Compress each PDF
      for (const file of req.files) {
        try {
          const inputPath = file.path;
          const outputFilename = `compressed-${file.originalname}`;
          const outputPath = path.join(batchDir, outputFilename);

          // Read the PDF
          const existingPdfBytes = await fs.readFile(inputPath);
          const pdfDoc = await PDFDocument.load(existingPdfBytes);

          // Apply optimization options
          if (removeImages) {
            // Simplified image removal - in practice, this needs more sophisticated handling
          }

          if (removeFonts) {
            // Font removal is complex
          }

          if (removeMetadata) {
            pdfDoc.setTitle('');
            pdfDoc.setAuthor('');
            pdfDoc.setSubject('');
            pdfDoc.setKeywords([]);
            pdfDoc.setProducer('');
            pdfDoc.setCreator('');
          }

          if (optimizeForWeb) {
            compressionOptions = { ...compressionOptions, useObjectStreams: true };
          }

          const pdfBytes = await pdfDoc.save(compressionOptions);
          await fs.writeFile(outputPath, pdfBytes);

          compressedFiles.push({
            originalName: file.originalname,
            compressedPath: outputPath,
            compressedName: outputFilename,
            originalSize: file.size,
            compressedSize: pdfBytes.length
          });

          // Clean up original file
          await fs.remove(inputPath);
        } catch (fileError) {
          console.error(`Error compressing ${file.originalname}:`, fileError);
          errors.push({
            filename: file.originalname,
            error: fileError.message
          });
        }
      }

      if (compressedFiles.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to compress any PDFs',
          errors
        });
      }

      if (outputMode === 'zip' || compressedFiles.length > 1) {
        // Create ZIP file
        const zipPath = path.join(path.dirname(batchDir), `compressed-pdfs-${batchId}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', async () => {
          console.log(`Archive created: ${archive.pointer()} total bytes`);
          
          res.download(zipPath, `compressed-pdfs-${batchId}.zip`, async (err) => {
            if (err) console.error('Download error:', err);
            
            // Clean up
            await fs.remove(batchDir);
            await fs.remove(zipPath);
          });
        });

        archive.on('error', (err) => {
          console.error('Archive error:', err);
          res.status(500).json({
            success: false,
            message: 'Failed to create ZIP archive'
          });
        });

        archive.pipe(output);

        for (const file of compressedFiles) {
          archive.file(file.compressedPath, { name: file.compressedName });
        }

        await archive.finalize();
      } else {
        // Return single file
        const singleFile = compressedFiles[0];
        res.download(singleFile.compressedPath, singleFile.compressedName, async (err) => {
          if (err) console.error('Download error:', err);
          
          await fs.remove(batchDir);
        });
      }

    } catch (error) {
      console.error('Batch PDF compression error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compress PDFs'
      });
    }
  }

  async wordToPDF(req, res) {
    try {
      console.log('Word to PDF request received');
      console.log('Request file:', req.file);
      console.log('Request body:', req.body);
      
      if (!req.file) {
        console.log('No file in request');
        return res.status(400).json({
          success: false,
          message: 'No Word file uploaded'
        });
      }

      const inputPath = req.file.path;

      // Validate file extension
      const allowedExtensions = ['.docx', '.doc'];
      const fileExtension = path.extname(req.file.originalname).toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        await fs.remove(inputPath);
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Expected .docx or .doc file, got ${fileExtension}`
        });
      }

      // Check if file exists and is readable
      try {
        await fs.access(inputPath, fs.constants.R_OK);
      } catch (error) {
        await fs.remove(inputPath);
        return res.status(400).json({
          success: false,
          message: 'Uploaded file is not accessible or corrupted'
        });
      }

      // Get file stats to check if it's not empty
      const stats = await fs.stat(inputPath);
      console.log('File stats:', {
        size: stats.size,
        path: inputPath,
        exists: await fs.pathExists(inputPath)
      });
      
      if (stats.size === 0) {
        await fs.remove(inputPath);
        return res.status(400).json({
          success: false,
          message: 'Uploaded file is empty'
        });
      }
      
      if (stats.size < 100) {
        console.log('Warning: File size is very small:', stats.size, 'bytes');
        // Let's try to read the file content to see what's in it
        try {
          const fileContent = await fs.readFile(inputPath);
          console.log('File content preview (first 200 chars):', fileContent.toString().substring(0, 200));
        } catch (readError) {
          console.log('Could not read file content:', readError.message);
        }
      }

      // For .docx files, validate the ZIP structure
      if (fileExtension === '.docx') {
        try {
          // Try to read the file as a buffer first to check if it's a valid zip
          const fileBuffer = await fs.readFile(inputPath);

          // Basic check for ZIP file signature (PK header)
          if (fileBuffer.length < 4 || !fileBuffer.subarray(0, 2).equals(Buffer.from([0x50, 0x4B]))) {
            await fs.remove(inputPath);
            return res.status(400).json({
              success: false,
              message: 'Invalid .docx file format. The file does not appear to be a valid Word document.'
            });
          }

          // Additional check for .docx specific content
          // .docx files should contain specific XML files in the zip structure
          // Check if it contains "word/document.xml" or similar structure
          try {
            const JSZip = require('jszip');
            const zip = await JSZip.loadAsync(fileBuffer);

            // Check if it has the basic structure of a .docx file
            const hasWordFolder = zip.folder('word') !== null;
            const hasDocumentXml = zip.file('word/document.xml') !== null;

            if (!hasWordFolder || !hasDocumentXml) {
              await fs.remove(inputPath);
              return res.status(400).json({
                success: false,
                message: 'Invalid .docx file structure. The file appears to be corrupted or is not a proper Word document.'
              });
            }
          } catch (zipError) {
            // If we can't parse it as a zip, it's definitely not a valid .docx
            await fs.remove(inputPath);
            return res.status(400).json({
              success: false,
              message: 'Invalid .docx file format. The file does not appear to be a valid Word document.'
            });
          }
        } catch (error) {
          await fs.remove(inputPath);
          return res.status(400).json({
            success: false,
            message: 'Unable to read the uploaded Word document'
          });
        }
      }

      // Extract content from Word document
      let result;
      try {
        console.log('Starting text extraction from Word document...');
        if (fileExtension === '.docx') {
          result = await mammoth.extractRawText({ path: inputPath });
          console.log('Mammoth extraction result:', {
            textLength: result.value ? result.value.length : 0,
            hasMessages: result.messages ? result.messages.length : 0,
            preview: result.value ? result.value.substring(0, 100) + '...' : 'No text'
          });
        } else if (fileExtension === '.doc') {
          // For .doc files, we'd need additional libraries like 'docx' or handle differently
          // For now, return an error as .doc support requires additional setup
          await fs.remove(inputPath);
          return res.status(400).json({
            success: false,
            message: '.doc files are not supported yet. Please convert your document to .docx format or use a .docx file.'
          });
        }
      } catch (mammothError) {
        console.error('Mammoth extraction error:', mammothError);
        await fs.remove(inputPath);
        return res.status(400).json({
          success: false,
          message: 'Failed to extract text from the Word document. The file may be corrupted or password-protected.'
        });
      }

      const text = result.value;

      if (!text || text.trim().length === 0) {
        await fs.remove(inputPath);
        return res.status(400).json({
          success: false,
          message: 'No text content found in the Word document'
        });
      }

      // Generate PDF from extracted text
      const outputPath = path.join(path.dirname(inputPath), `converted-${req.file.filename.replace(/\.[^/.]+$/, '.pdf')}`);

      try {
        // Create a new PDF document
        const doc = new PDFDocumentKit();

        // Write PDF to file
        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        // Add title
        doc.fontSize(20).text('Word Document Content', { align: 'center' });
        doc.moveDown();

        // Split text into chunks that fit the page width
        const maxWidth = 500; // Approximate width for A4 page
        const lines = doc.fontSize(12).font('Helvetica');

        // Split text into paragraphs and add them to PDF
        const paragraphs = text.split('\n\n');
        paragraphs.forEach(paragraph => {
          if (paragraph.trim()) {
            // Split long paragraphs into lines
            const words = paragraph.split(' ');
            let line = '';

            words.forEach(word => {
              const testLine = line + (line ? ' ' : '') + word;
              const width = lines.widthOfString(testLine);

              if (width > maxWidth && line) {
                doc.text(line);
                line = word;
              } else {
                line = testLine;
              }
            });

            if (line) {
              doc.text(line);
            }

            doc.moveDown();
          }
        });

        doc.end();

        // Wait for the PDF to be fully written
        await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        // Send the generated PDF file
        res.download(outputPath, `converted-${req.file.originalname.replace(/\.[^/.]+$/, '.pdf')}`, async (err) => {
          if (err) console.error('Download error:', err);

          // Clean up files
          await fs.remove(inputPath);
          await fs.remove(outputPath);
        });

      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);

        // Clean up input file on PDF generation error
        await fs.remove(inputPath);

        return res.status(500).json({
          success: false,
          message: 'Failed to generate PDF from Word document'
        });
      }

    } catch (error) {
      console.error('Word to PDF conversion error:', error);

      // Clean up input file on error
      if (req.file && req.file.path) {
        try {
          await fs.remove(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }

      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while processing the Word document'
      });
    }
  }
}

module.exports = new PDFController();