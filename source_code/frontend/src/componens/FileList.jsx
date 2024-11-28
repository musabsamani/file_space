import React, { useEffect, useState } from 'react';
import { getFiles, viewFile } from '../services/api';

const FileList = ({ token }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        getFiles(token)
            .then((filesData) => setFiles(filesData))
            .catch((error) => console.error('Error fetching files', error));
    }, [token]);

    const handleViewFile = async (fileId) => {
        try {
            await viewFile(fileId);
            alert('File viewed');
        } catch (error) {
            alert('Failed to view file');
        }
    };

    return (
        <div>
            <h3>Your Files</h3>
            <ul>
                {files.map((file) => (
                    <li key={file._id}>
                        <p>{file.filename}</p>
                        <button onClick={() => handleViewFile(file._id)}>View</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
