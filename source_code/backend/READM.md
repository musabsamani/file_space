# Tech Test - BackEnd

This project is a Node.js-based application that allows users to securely upload and manage image or video files. The API supports user authentication, file tagging, sharing, and tracks statistics like the number of views for each file.

## Features

- **User Authentication**: Secure login and registration with JWT tokens.
- **File Upload**: Upload images or video files with a tagging system.
- **File Sharing**: Generate shareable links for public access to files.
- **Statistics**: Track and display the number of views for each file.
- **Error Handling**: Custom error handling and logging with Winston.

## Tech Stack

- **Backend**: Node.js, Express
- **Authentication**: JWT, bcrypt
- **Database**: MongoDB (for demo purposes, you can switch to another DB)
- **File Upload**: Multer
- **Logging**: Winston
- **CORS**: For cross-origin requests
- **Environment Variables**: Dotenv

## Requirements

- Node.js (v14+ recommended)
- MongoDB or another database of your choice
- Environment variables for secrets (`.env` file)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/musabsamani/tech_test.git
```

1. open backend folder and Install dependencies for the frontend and the backend:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following:

```env
PORT
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
UPLOAD_FOLDER=/uploads
```

4. Run the application:

```bash
npm run dev
```

This will start the server on `http://localhost:PORT`.

## File Upload Folder

The application creates an `uploads` folder automatically in the project root if it does not exist. All uploaded files are stored here.

## API Endpoints

### 1. **POST /register**

- **Description**: Register a new user.
- **Request Body**:

  ```json
  {
    "username": "user123",
    "password": "password123"
  }
  ```

- **Response**: `200 OK` on success.

### 2. **POST /login**

- **Description**: Login and get a JWT token.
- **Request Body**:

  ```json
  {
    "username": "user123",
    "password": "password123"
  }
  ```

- **Response**:

  ```json
  {
    "token": "your-jwt-token"
  }
  ```

### 3. **POST /upload**

- **Description**: Upload an image or video file.
- **Authorization**: Bearer token required.
- **Request Body** (form-data):
  - `file`: Image or video file
  - `tags`: Comma-separated tags (optional)
- **Response**: `201 Created` on success.

### 4. **GET /files**

- **Description**: Retrieve the list of files uploaded by the authenticated user.
- **Authorization**: Bearer token required.
- **Response**: JSON array of file objects:

  ```json
  [
    {
      "filename": "file123.jpg",
      "path": "/uploads/file123.jpg",
      "tags": ["nature", "vacation"]
    }
  ]
  ```

### 5. **GET /public/:filename**

- **Description**: Get a file publicly by filename.
- **Response**: The file content.

### 6. **Error Handling**

The API has custom error handling for undefined endpoints and other errors. Errors are logged using Winston, and appropriate error messages are returned to the client.

## Logs

Logs are stored in `exceptions.log` and `logfile.log`. The application uses `winston` for logging incoming requests, errors, and application-level logs.

## Development

### Run the app in development mode

```bash
npm run dev
```

This command will start the app with `nodemon`, automatically reloading the server on file changes.

### Testing

To test the application, you can use tools like Postman or CURL to make API requests.

Postman workspace

```text
https://app.getpostman.com/join-team?invite_code=21038563c71c65318657d9e48f20dc36&target_code=3d94c46357d697618273f4068a4a12a0
```
