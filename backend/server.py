import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from ai.main import load_model, load_doc, return_real_values, return_cats, return_cnpjs, return_validity, return_contractant, return_contractor
from utils.pdf import extract_text_from_pdf

# Carregando o modelo ao iniciar o server
load_model()

# Registrando o app Flask, bem como configurando o CORS para todos os métodos e origens
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "HEAD", "OPTIONS"]}})

# Função que a pasta onde os contratos enviados serão salvos temporariamente, se não existir ainda no servidor do backend
def create_contracts_dir():
    if not os.path.exists("./tests_contracts"):
        os.makedirs("./tests_contracts")

#Criando o diretório dos contratos
create_contracts_dir()

# Função responsável pelo upload dos arquivos. Após a verificação e possivel criação do diretório, o arquivo é salvo, e tem seu texto extraido, que também é o retorno da função
def upload_file(file):
    create_contracts_dir()
    filepath = os.path.join("./tests_contracts", file.filename)
    file.save(filepath)
    text = extract_text_from_pdf(filepath)
    return [text, filepath]

# Função que invoca primeiramente o processamento do texto pelo modelo PT-BR da IA. Após isso, as funções no arquivo './ai/main.py' são invocadas para retornar as informações do texto como um objeto JSON
def show_file_info(text, mode, filepath):
    try:
        load_doc(text)
        cnpjs = return_cnpjs(mode)
        real_values = return_real_values(mode)
        cats = return_cats(text)
        date = return_validity(text)
        contractant = return_contractant()
        contractor = return_contractor()
        print("Process finished sucessfully")
        return jsonify({"message": "Success!", "cnpjs": cnpjs, "real_values": real_values, "cats": cats, "date": date, "contractant": contractant, "contractor": contractor}), 200
    except Exception as e:
        print("Error on server: " + str(e))
        return jsonify({"error": "Failed to process the file: " + str(e)}), 500
    finally: 
        try:
            os.remove(filepath)
        except Exception as e:
            print("Error while trying to remove the file: " + str(e))
    
# Rota para processamento de texto, recebe um JSON com o texto e o modo da análise (exato / não exato). Invoca a função para mostrar as informações logo em seguida
@app.route("/post/process-text", methods=["POST"])
def process_document_text():
    try:
        data = request.get_json()  
        text = data.get('text')    
        mode = data.get('mode') 
        return show_file_info(text, mode)
    except Exception as e:
        print("Error on client: " + str(e))
        return jsonify({"error": str(e)}), 400

# Rota para upload de arquivos, que são então transformados em texto. Recebe um FormData, que contém o arquivo e o modo. Após transformar o arquivo em texto, invoca a função para mostrar as informações logo em seguida 
@app.route("/post/upload-file", methods=["POST"])
def handle_file_upload():
    try:
        print("Contract upload started...")
        file = request.files.get("file")
        mode = request.form['mode']
        text_and_filepath = upload_file(file)
        text = text_and_filepath[0]
        filepath = text_and_filepath[1]
        print("Starting to stract file info. Filepath:" + filepath)
        return show_file_info(text, mode, filepath)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

# Rota de hello world apenas para testar se o server está funcionando
@app.route("/helloworld", methods=["GET"])
def hello_world():
    return "Hello World"

# Definindo o host e o port do server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
