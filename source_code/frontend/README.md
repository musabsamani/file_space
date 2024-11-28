# Tech Test - FrontEnd

This project is a React-based application that allows users to interact with the backend API to securely upload and manage image or video files. The frontend provides a user interface for authentication, file uploads, and managing files with features such as tagging and sharing.

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **File Upload**: Upload image or video files with an optional tagging system.
- **File Management**: Display uploaded files and allow users to view, tag, and manage their files.
- **File Sharing**: Generate shareable links to allow public access to files.
- **Responsive Design**: Built with mobile-first principles using React and CSS Flexbox/Grid.

## Tech Stack

- **Frontend**: React, React Router, Axios, CSS (or a CSS framework like Bootstrap or Material-UI)
- **Authentication**: JWT tokens
- **State Management**: React Context API or Redux
- **File Upload**: Axios (for making HTTP requests)

## Requirements

- Node.js (v14+ recommended)
- npm (Node package manager)
- A running instance of the backend API (refer to the Backend README)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/musabsamani/tech_test.git
cd tech_test/frontend
```

2. Install the required dependencies:

```bash
npm install
```

3. Set up the environment variables:

Create a `.env` file in the root directory of the frontend and add the following:

```env
REACT_APP_API_URL=[backend_api_url]
```

4. Run the application:

```bash
npm start
```

This will start the React development server on `http://localhost:3000`.

---

## Application Structure

```text
frontend/
├── .gitignore
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FileUpload.js
│   │   ├── FileList.js
│   │   └── Login.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   └── Home.js
│   ├── App.js
│   ├── index.js
│   └── styles/
│       └── App.css
└── README.md
```

### Components

- **FileUpload**: Allows users to upload image or video files.
- **FileList**: Displays the list of uploaded files with actions like viewing or sharing.
- **Login**: Handles user login functionality.

### Context

- **AuthContext**: Manages user authentication and JWT tokens.

### Pages

- **Home**: The main page that displays uploaded files and provides navigation to the login and file upload pages.

---

## API Integration

### 1. **User Authentication**

- **Login**: Sends a POST request to the `/login` API endpoint with the user's credentials and stores the JWT token in local storage for authentication.

```javascript
  const login = async (username, password) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
    localStorage.setItem('token', response.data.token);
  };
```

### 2. **File Upload**

- **Upload**: Sends a POST request to the `/upload` API endpoint with the file data (image or video) and optional tags.

```javascript
  const uploadFile = async (file, tags) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  };
```

### 3. **Retrieve Files**

- **Get Files**: Sends a GET request to the `/files` API endpoint to fetch the list of files uploaded by the authenticated user.

```javascript
  const getFiles = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  };

```

## Development

### Run the app in development mode

```bash
npm start
```

This command will run the app in development mode, automatically opening it in your default browser.

### Build for production

```bash
npm run build
```

This will create an optimized production build in the `build` folder.
