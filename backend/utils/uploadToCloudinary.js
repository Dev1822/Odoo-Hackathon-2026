const cloudinary = require('../config/cloudinary');
const { ApiError } = require('../middlewares/errorHandler');
const { promisify } = require('util');

const uploadStream = promisify(cloudinary.uploader.upload_stream);

const uploadToCloudinary = async (buffer, folder = 'ecosphere/gamification/proofs') => {
  try {
    const result = await uploadStream({
      folder,
      resource_type: 'auto'
    }, (error, result) => {
      if (error) throw error;
      return result;
    }).end(buffer);

    return result.secure_url;
  } catch (error) {
    throw new ApiError(500, 'Failed to upload file to Cloudinary');
  }
};

module.exports = uploadToCloudinary;
