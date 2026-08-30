import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_UPLOAD_DIR = path.join(__dirname, '../../uploads');

const ensureLocalDir = async () => {
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
};

const uploadToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'jsip',
        resource_type: options.resourceType || 'auto',
        public_id: options.publicId,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

const uploadLocally = async (buffer, originalName, mimetype) => {
  await ensureLocalDir();
  const ext = path.extname(originalName) || '.bin';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return {
    url: `/uploads/${filename}`,
    publicId: filename,
    provider: 'local',
    mimetype,
    size: buffer.length,
  };
};

export const uploadFile = async (file, options = {}) => {
  if (!file?.buffer && !file?.path) {
    throw new Error('No file provided');
  }

  const buffer = file.buffer || (await fs.readFile(file.path));
  const originalName = file.originalname || 'file';
  const mimetype = file.mimetype || 'application/octet-stream';

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(buffer, options);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        provider: 'cloudinary',
        mimetype: result.resource_type,
        size: result.bytes,
        format: result.format,
      };
    } catch (error) {
      console.warn('Cloudinary upload failed, falling back to local:', error.message);
    }
  }

  return uploadLocally(buffer, originalName, mimetype);
};

export const deleteFile = async (publicId, provider = 'cloudinary') => {
  if (provider === 'cloudinary' && isCloudinaryConfigured() && publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.warn('Cloudinary delete failed:', error.message);
    }
  }

  if (provider === 'local' && publicId) {
    const filepath = path.join(LOCAL_UPLOAD_DIR, publicId);
    try {
      await fs.unlink(filepath);
      return true;
    } catch {
      return false;
    }
  }

  return false;
};

export default { uploadFile, deleteFile };
