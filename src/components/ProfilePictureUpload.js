import React, { useState, useRef } from 'react';
import UploadService from '../services/UploadService';

const ProfilePictureUpload = ({ userId, currentPictureUrl, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPictureUrl);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');

    try {
      const response = await UploadService.uploadProfilePicture(userId, file);
      setPreview(response.data.url);
      if (onUploadSuccess) {
        onUploadSuccess(response.data.url);
      }
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      setPreview(currentPictureUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      await UploadService.deleteProfilePicture(userId);
      setPreview(null);
      if (onUploadSuccess) {
        onUploadSuccess(null);
      }
    } catch (err) {
      setError('Failed to delete image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="text-center mb-3">
        <div className="position-relative d-inline-block">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
              style={{ width: '150px', height: '150px' }}
            >
              <i className="fas fa-user fa-4x text-white"></i>
            </div>
          )}

          {uploading && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex justify-content-center gap-2">
        <button
          className="btn btn-primary"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          <i className="fas fa-upload me-2"></i>
          {preview ? 'Change Picture' : 'Upload Picture'}
        </button>

        {preview && (
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={uploading}
          >
            <i className="fas fa-trash me-2"></i>
            Delete
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="text-center mt-2">
        <small className="text-muted">
          Supported formats: JPG, PNG, GIF (Max 5MB)
        </small>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
