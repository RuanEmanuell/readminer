# Frontend Project with React ⚛️

This is a frontend project built using React. It consists of two main pages: one for uploading new files and another for viewing the already uploaded files. The interface is designed to facilitate easy interaction with the AI-backed backend, allowing users to upload contracts for analysis and view the results.

## 🗂 Project Structure

- **Upload Page**: This page allows users to upload new contract files (currently supporting PDF files). The uploaded files are sent to the backend for processing and analysis. 
- **View Contracts Page**: Displays the list of all uploaded files with their respective classifications, as analyzed by the backend AI. Users can paginate through the results and search for specific files.

## 🔧 Installation Instructions

To set up the frontend locally, follow these steps:

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Start the development server:**
    ```bash
    npm start
    ```

3. **Production build:**
    For production, you can create a build with:
    ```bash
    npm run build
    ```

## 🚀 Pages Overview

### Upload Page
- **Functionality**: Users can select and upload new contract files (PDFs) for analysis.
- **Validation**: The system currently only accepts PDF files.
- **Submission**: Once the file is uploaded, it is processed by the backend AI.

### View Contracts Page
- **Displays**: A list of previously uploaded contracts with their classifications.
- **Pagination**: Users can navigate through multiple pages of contracts.
- **Search**: A search bar is provided to filter contracts by file name.

