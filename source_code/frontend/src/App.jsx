import React, { useState } from 'react';
import FileUpload from './componens/FileUpload';
import LoginForm from './componens/LoginForm';
import FileList from './componens/FileList';
import Statistics from './componens/Statistics';
import './app.css';

const App = () => {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthSuccess = (token) => {
    setToken(token);
    setAuthenticated(true);
  };

  return (
    <>
      {!authenticated ? (
        <LoginForm onAuthSuccess={handleAuthSuccess} />
      ) : (
        <div>
          <FileUpload token={token} onFileUploaded={(file) => alert('File uploaded!')} />
          <FileList token={token} />
          <Statistics token={token} />
        </div>
      )}
    </>
  );
};

export default App;
