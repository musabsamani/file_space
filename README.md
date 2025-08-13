
# File Upload Management API

This project is a Node.js-based application that allows users to securely upload and manage image or video files. The API supports user authentication, file tagging, sharing, and tracks statistics like the number of views for each file.

## Features

- **User Authentication**: Secure login and registration with JWT tokens.
- **File Upload**: Upload image/video files with optional tags.
- **File Management**: Retrieve uploaded files and manage them.
- **File Sharing**: Generate public access links for files.
- **Error Handling**: Centralized error logging and handling using `winston`.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (or another database)
- **Frontend**: React (or other frontend framework)
- **Authentication**: JWT tokens, bcrypt for password hashing
- **File Upload**: Multer
- **Logging**: Winston
- **CORS**: For handling cross-origin requests
- **Environment Variables**: `dotenv` for configuration management

## Project Structure

The project is organized as follows:

```text
├── TECH_TEST
│   ├── documentation
│   ├── source_code
│   │   ├── backend
│   │   │   ├── node_modules
│   │   │   ├── src
│   │   │   ├── uploads
│   │   │   ├── .env
│   │   │   ├── exceptions.log
│   │   │   ├── logfile.log
│   │   │   ├── package.json
│   │   │   ├── package-lock.json
│   │   │   ├── tsconfig.json
│   │   └── frontend
│   │       ├── .gitignore
│   │       └── README.md
├── .gitignore
└── README.md
```

### Backend

The backend is located in the `backend` folder and uses Node.js with Express to handle API requests.

### Frontend

The frontend folder (`frontend`) contains the client-side code for interacting with the backend API, including forms for uploading files and managing the user interface.
it is a React application that allows users to upload and manage files
---

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/musabsamani/tech_test.git
```

2. **Install Backend Dependencies**:

Navigate to the backend directory and install the required dependencies.

```bash
cd source_code/backend
npm install
```

3. **Install Frontend Dependencies**:

Navigate to the frontend directory (if separate) and install the required dependencies.

```bash
cd source_code/frontend
npm install
```

4. **Set up environment variables**:

Create a `.env` file in the `backend` directory and define the following environment variables:

```env
PORT
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
UPLOAD_FOLDER=/uploads
```

5. **Run the Application**:

To start the backend, run:

```bash
cd source_code/backend
npm start
```

For the frontend (if separate):

```bash
cd source_code/frontend
npm start
```

<!-- The backend will run on `http://localhost:[PORT]`, and the frontend will run on `http://localhost:3001`. -->
