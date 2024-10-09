@echo off

cd backend

echo Instalando dependencias necessárias para o backend...

pip install flask
pip install flask_cors
pip install -U spacy
python -m spacy download pt_core_news_sm
pip install PyPDF2

start cmd /k "cd ../frontend & echo Instalando dependencias necessárias para o frontend.. & npm install & npm start & echo Iniciando o servidor frontend... & start msedge http://localhost:3000/"

echo Iniciando o servidor backend...

python -m flask --app server run --reload