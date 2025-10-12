const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const archiver = require('archiver');

class ImageController {
  async convertImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded'
        });
      }

      const { format = 'png' } = req.body;
      const inputPath = req.file.path;
      const outputPath = path.join(
        path.dirname(inputPath), 
        `converted-${path.parse(req.file.filename).name}.${format}`
      );

      if (format === 'pdf') {
        // Convert image to PDF
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await fs.readFile(inputPath);
        
        let image;
        const mimeType = req.file.mimetype;
        
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (mimeType === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          // Convert other formats to PNG first, then embed
          const pngBuffer = await sharp(imageBytes).png().toBuffer();
          image = await pdfDoc.embedPng(pngBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });

        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);
      } else {
        // Convert image to other formats
        await sharp(inputPath)
          .toFormat(format)
          .toFile(outputPath);
      }

      const originalName = path.parse(req.file.originalname).name;
      const downloadName = `${originalName}.${format}`;

      res.download(outputPath, downloadName, async (err) => {
        if (err) console.error('Download error:', err);
        
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });

    } catch (error) {
      console.error('Image conversion error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to convert image'
      });
    }
  }

  async compressImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded'
        });
      }

      const { quality = 80 } = req.body;
      const inputPath = req.file.path;
      const outputPath = path.join(path.dirname(inputPath), `compressed-${req.file.filename}`);

      const qualityValue = Math.max(10, Math.min(100, parseInt(quality)));

      await sharp(inputPath)
        .jpeg({ quality: qualityValue })
        .toFile(outputPath);

      res.download(outputPath, `compressed-${req.file.originalname}`, async (err) => {
        if (err) console.error('Download error:', err);
        
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      });

    } catch (error) {
      console.error('Image compression error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compress image'
      });
    }
  }

  async compressBatchImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files uploaded'
        });
      }

      const { quality = 80 } = req.body;
      const qualityValue = Math.max(10, Math.min(100, parseInt(quality)));
      
      // Create a unique directory for this batch
      const batchId = Date.now().toString();
      const batchDir = path.join(path.dirname(req.files[0].path), `batch-${batchId}`);
      await fs.ensureDir(batchDir);

      const compressedFiles = [];

      // Compress each image
      for (const file of req.files) {
        try {
          const inputPath = file.path;
          const outputFilename = `compressed-${file.originalname}`;
          const outputPath = path.join(batchDir, outputFilename);

          // Determine output format based on input
          const inputFormat = path.extname(file.originalname).toLowerCase();
          let sharpInstance = sharp(inputPath);

          if (inputFormat === '.jpg' || inputFormat === '.jpeg') {
            sharpInstance = sharpInstance.jpeg({ quality: qualityValue });
          } else if (inputFormat === '.png') {
            sharpInstance = sharpInstance.png({ quality: qualityValue });
          } else if (inputFormat === '.webp') {
            sharpInstance = sharpInstance.webp({ quality: qualityValue });
          } else {
            // Convert to JPEG for other formats
            sharpInstance = sharpInstance.jpeg({ quality: qualityValue });
          }

          await sharpInstance.toFile(outputPath);
          
          compressedFiles.push({
            originalName: file.originalname,
            compressedPath: outputPath,
            compressedName: outputFilename
          });

          // Clean up original file
          await fs.remove(inputPath);
        } catch (fileError) {
          console.error(`Error compressing ${file.originalname}:`, fileError);
          // Continue with other files even if one fails
        }
      }

      if (compressedFiles.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to compress any images'
        });
      }

      // Create ZIP file
      const zipPath = path.join(path.dirname(batchDir), `compressed-images-${batchId}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Handle archive events
      output.on('close', async () => {
        console.log(`Archive created: ${archive.pointer()} total bytes`);
        
        // Send the ZIP file
        res.download(zipPath, `compressed-images-${batchId}.zip`, async (err) => {
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

      // Pipe archive data to the file
      archive.pipe(output);

      // Add files to archive
      for (const file of compressedFiles) {
        archive.file(file.compressedPath, { name: file.compressedName });
      }

      // Finalize the archive
      await archive.finalize();

    } catch (error) {
      console.error('Batch compression error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compress images'
      });
    }
  }

  async convertBatchImages(req, res) {
    try {
      console.log('=== Convert batch request received ===');
      console.log('Files:', req.files ? req.files.length : 'none');
      console.log('Files details:', req.files);
      console.log('Body:', req.body);
      console.log('Headers:', req.headers);
      
      if (!req.files || req.files.length === 0) {
        console.error('ERROR: No files received in request');
        return res.status(400).json({
          success: false,
          message: 'No image files uploaded'
        });
      }

      const { format = 'png', outputMode = 'zip' } = req.body;
      
      // Create a unique directory for this batch
      const batchId = Date.now().toString();
      const batchDir = path.join(path.dirname(req.files[0].path), `batch-convert-${batchId}`);
      await fs.ensureDir(batchDir);

      const convertedFiles = [];
      const errors = [];

      // Convert each image
      for (const file of req.files) {
        try {
          const inputPath = file.path;
          const originalName = path.parse(file.originalname).name;
          const outputFilename = `${originalName}.${format}`;
          const outputPath = path.join(batchDir, outputFilename);

          if (format === 'pdf') {
            // Convert image to PDF
            const pdfDoc = await PDFDocument.create();
            const imageBytes = await fs.readFile(inputPath);
            
            let image;
            const mimeType = file.mimetype;
            
            if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
              image = await pdfDoc.embedJpg(imageBytes);
            } else if (mimeType === 'image/png') {
              image = await pdfDoc.embedPng(imageBytes);
            } else {
              // Convert other formats to PNG first, then embed
              const pngBuffer = await sharp(imageBytes).png().toBuffer();
              image = await pdfDoc.embedPng(pngBuffer);
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });

            const pdfBytes = await pdfDoc.save();
            await fs.writeFile(outputPath, pdfBytes);
          } else {
            // Convert image to other formats
            await sharp(inputPath)
              .toFormat(format)
              .toFile(outputPath);
          }
          
          convertedFiles.push({
            originalName: file.originalname,
            convertedPath: outputPath,
            convertedName: outputFilename
          });

          // Clean up original file
          await fs.remove(inputPath);
        } catch (fileError) {
          console.error(`Error converting ${file.originalname}:`, fileError);
          errors.push({
            filename: file.originalname,
            error: fileError.message
          });
          // Continue with other files even if one fails
        }
      }

      if (convertedFiles.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to convert any images',
          errors
        });
      }

      // Create ZIP file
      const zipPath = path.join(path.dirname(batchDir), `converted-images-${batchId}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Handle archive events
      output.on('close', async () => {
        console.log(`Archive created: ${archive.pointer()} total bytes`);
        
        // Send the ZIP file
        res.download(zipPath, `converted-images-${batchId}.zip`, async (err) => {
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

      // Pipe archive data to the file
      archive.pipe(output);

      // Add files to archive
      for (const file of convertedFiles) {
        archive.file(file.convertedPath, { name: file.convertedName });
      }

      // Finalize the archive
      await archive.finalize();

    } catch (error) {
      console.error('Batch conversion error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to convert images'
      });
    }
  }
}

module.exports = new ImageController();