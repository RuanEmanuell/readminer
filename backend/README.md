# Backend Project with Flask 🐍

This is a backend project built with Python using the Flask framework. It includes an AI for document analysis, developed with SpaCy, along with a simple frontend for testing purposes.

## 🗂 Project Structure

- **server.py**: The main file that runs the Flask server.
- **main.py**: Contains the AI for document analysis, using SpaCy.
- **training/**: Directory that holds the trained model for contracts, as well as a `.txt` file containing classifications for example documents used for training. Example documents should be added to `.gitignore` before the project becomes public for Granto.
- **frontend-tests/**: Directory containing a simple frontend for testing.

## 🔧 Installation Instructions

If the `run.bat` script located in the root folder hasn’t been executed, follow the steps below to install the backend dependencies:

1. **Install Flask:**
    ```bash
    pip install flask
    ```

2. **Install Flask plugin for CORS (Cross-Origin Resource Sharing):**
    ```bash
    pip install flask_cors
    ```

3. **Install SpaCy:**
    ```bash
    pip install -U spacy
    ```

4. **Download the SpaCy language model:**
    ```bash
    python -m spacy download pt_core_news_sm
    ```

5. **Install PyPDF2 for PDF text extraction:**
    ```bash
    pip install PyPDF2
    ```

## 🏋️ Training the Model

To train the model, follow these steps:

1. Add the PDFs you want in the directory `./ai/training/training_data/documents`, following the naming conventions there.
2. Add their classifications in the file `../documents_cats.txt`.
3. In the `../training` directory, open `training.py` and run the command:
    ```bash
    python training.py
    ```
4. Wait for the training process to complete.

## 🚀 Running the Backend

To run the Flask server, you can use the `run.bat` file in the main directory, which runs both the backend server and the frontend, or use the command below:

```bash
flask --app server run
```