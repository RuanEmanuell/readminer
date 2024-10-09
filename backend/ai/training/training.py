import json
import sys
import os
import random
import spacy

# Adiciona o diretório pai ao caminho do sistema para permitir a importação de módulos
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

# Importa funções personalizadas para ler arquivos de texto e extrair texto de PDFs
from utils.txt import read_text_file
from utils.pdf import extract_text_from_pdf
from spacy.training.example import Example  # Importa a classe Example para criação de exemplos de treinamento

# Carrega o modelo SpaCy pré-treinado para português
nlp = spacy.load("pt_core_news_sm")

# Verifica se o pipeline de classificação de texto multilabel já está presente
if "textcat_multilabel" not in nlp.pipe_names:
    textcat = nlp.add_pipe("textcat_multilabel", last=True)  # Adiciona o pipeline de classificação de texto multilabel
else:
    textcat = nlp.get_pipe("textcat_multilabel")  # Obtém o pipeline de classificação de texto multilabel existente

# Adiciona as etiquetas (labels) ao classificador
textcat.add_label("aluguel")
textcat.add_label("prestacao_servico")
textcat.add_label("venda_compra")
textcat.add_label("confidencialidade")
textcat.add_label("parceria")

train_data = []

lines = read_text_file("./training_data/document_cats.txt")

# Carrega os dados de treinamento a partir do JSON
json_data = {"training_cats": json.loads(lines)}

try:
    # Itera sobre cada item nos dados de treinamento, extraindo o texto de cada PDF e construindo um dicionário de etiquetas e pontuações das classificações
    for item in json_data["training_cats"]:
        text = extract_text_from_pdf("./training_data/documents/" + item["name"] + ".pdf")
        annotations = item["cats"]
        cats_dict = {label: score for label, score in annotations.items()}
        train_data.append((text, {"cats": cats_dict}))

    # Inicializa o otimizador para o treinamento do modelo
    optimizer = nlp.begin_training()
    print("Starting training...")

    # Realiza o treinamento em 100 iterações, pode demorar um pouco
    for i in range(100):
        random.shuffle(train_data)  
        for text, annotations in train_data:
            doc = nlp.make_doc(text)  
            example = Example.from_dict(doc, annotations)  
            nlp.update([example], drop=0.5) 
        print("Iteration successful: " + str(i))

    print("Training finished. Saving new model.")

    # Salva o novo modelo treinado no disco
    nlp.to_disk("model_contracts")

    print("New model successfully saved.")
except Exception as exc:
    print("Something went wrong: " + str(exc))  