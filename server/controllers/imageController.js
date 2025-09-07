const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

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
}

module.exports = new ImageController();