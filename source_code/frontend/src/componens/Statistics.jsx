import React, { useEffect, useState } from 'react';
import { getFiles } from '../services/api';

const Statistics = ({ token }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        getFiles(token)
            .then((filesData) => setFiles(filesData))
            .catch((error) => console.error('Error fetching files', error));
    }, [token]);

    return (
        <div>
            <h3>File Statistics</h3>
            <ul>
                {files.map((file) => (
                    <li key={file._id}>
                        <p>{file.filename} - Views: {file.views}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Statistics;
