import React from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../services/api';

const FileUpload = ({ token, onFileUploaded }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*,video/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const tags = prompt('Enter tags (comma separated):');
            uploadFile(file, tags, token)
                .then((fileData) => onFileUploaded(fileData))
                .catch((error) => alert('Failed to upload file'));
        },
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px' }}>
            <input {...getInputProps()} />
            <p>Drag & drop some files here, or click to select files</p>
        </div>
    );
};

export default FileUpload;
