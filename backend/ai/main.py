import re
import spacy
import os
from datetime import timedelta
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta

# Iniciando as variáveis do NLP e do DOC (texto processado pela IA)
nlp = None
doc = ""

# Iniciando as variáveis do nosso NLP e do caminho do nosso modelo customizado (usado para a parte de classificação de texto da IA)
custom_nlp = None
custom_model_path = os.path.abspath("./ai/training/model_contracts")

# Carregando o modelo da IA. Ele é carregado ao server do backend ser ligado no arquivo 'server.py'
def load_model():
    global nlp
    nlp = spacy.load("pt_core_news_sm")
    print("Spacy portuguese model loaded")
    
# Carregando o nosso modelo customizado que é treinado para classificar o texto. Ele pode ser encontrado no diretório /training
def load_custom_model():
    global custom_nlp
    custom_nlp = spacy.load(custom_model_path)
    print("Custom AI model loaded.")

# Processando o texto para ser transformado em documento. Ele é feito sempre que um novo arquivo é enviado para a IA processar. É feito apenas uma vez para evitar múltiplos processamentos do mesmo texto, que
# embora seja funcional, diminui o desempenho e o tempo necessário para o usuário aguardar. É melhor já processar apenas uma vez e usá-lo em todas as funções necessárias
def load_doc(text):
    global doc
    doc = nlp(text)
    print("Text processed by the AI")

# Função para validar regex, recebe a informação e verifica se o regex se encaixa nela
def validate_info(info, regex):
    return re.match(regex, info) is not None

def extract_entity_after_keywords(keywords):
    for token in doc:
        if token.text.upper() in keywords:
            count = 1
            entity_tokens = []
            while (token.i + count < len(doc)) and (count < 20):
                next_token = doc[token.i + count]
                if next_token.text in [":", "\n", "-", " "]:
                    count += 1
                    continue
                if next_token.ent_type_ in ["ORG", "PER", "COMPANY"] or next_token.pos_ in ["PROPN", "NOUN", "ADP", "DET", "CCONJ", "PUNCT", "ADJ"]:
                    entity_tokens.append(next_token.text)
                    count += 1
                    while (token.i + count < len(doc)) and (doc[token.i + count].ent_type_ in ["ORG", "PER", "COMPANY"] or doc[token.i + count].pos_ in ["PROPN", "NOUN", "ADP", "DET", "CCNJ", "PUNCT", "ADJ"]):
                        entity_tokens.append(doc[token.i + count].text)
                        count += 1
                    return " ".join(entity_tokens).strip()
                count += 1
    return None


def return_contractant():
    keywords = ["CONTRATANTE", "COMPRADOR", "LOCADOR", "PARCEIRA", "PARCEIRO", "DIVULGANTE", "DIVULGADORA", "CREDENCIANTE"]
    contractant = extract_entity_after_keywords(keywords)
    if contractant:
        print("Contractant processed. Contractant: " + contractant)
        return contractant
    print("Contractant processed. No contractant found.")
    return "Nenhum contratante encontrado"

def return_contractor():
    keywords = ["CONTRATADA", "VENDEDOR", "LOCATÁRIO", "PARCEIRA", "PARCEIRO", "RECEPTOR", "RECEPTORA", "CREDENCIADA"]
    contractor = extract_entity_after_keywords(keywords)
    if contractor:
        print("Contractor processed. Contractor: " + contractor)
        return contractor
    print("Contractor processed. No contractor found.")
    return "Nenhum contratado encontrado"

def extract_dates(text):
    doc = nlp(text)
    
    # Capturar datas com SpaCy
    context_dates = [ent.text for ent in doc.ents if ent.label_ == "DATE"]
    
    # Regex para datas no formato dd/mm/yyyy
    date_pattern = re.compile(r'\b\d{2}/\d{2}/\d{4}\b')
    regex_dates = date_pattern.findall(text)
    
    # Regex para datas no formato '21 de junho de 2024'
    extended_date_pattern = re.compile(r'\b\d{1,2} de \w+ de \d{4}\b')
    extended_regex_dates = extended_date_pattern.findall(text)
    
    return context_dates + regex_dates + extended_regex_dates

def convert_month_name_to_number(month_name):
    months = {
        'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
        'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
        'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
    }
    return months.get(month_name.lower(), None)

def calculate_relative_dates(text):
    # Regex para durações relativas
    relative_patterns = [
        r'(\d+)\s*\(\w+\)\s+(meses|dias|anos)\s+contados\s+a\s+partir\s+de\s+(\d{2}/\d{2}/\d{4})',
        r'(\d+)\s+(meses|dias|anos)\s+de\s+duração\s+a\s+partir\s+de\s+(\d{2}/\d{2}/\d{4})',
        r'validade\s+de\s+(\d+)\s+(meses|dias|anos)\s+iniciando-se\s+em\s+(\d{2}/\d{2}/\d{4})',
        r'execução\s+do\s+contrato\s+por\s+(\d+)\s+(meses|dias|anos),?\s+começando\s+em\s+(\d{2}/\d{2}/\d{4})',
        r'válido\s+por\s+(\d+)\s+(meses|dias|anos)\s+a\s+partir\s+de\s+(\d{2}/\d{2}/\d{4})',
        r'\d{2}/\d{2}/\d{4}', 
        r'\d{2}-\d{2}-\d{4}',  
        r'[a-z]+\s+\d{1,2},\s+\d{4}',  
        r'\d{1,2}\s+[a-z]{3}\.\s+\d{4}',  
        r'[A-Z][a-zéúíóáãõ]+\s+[A-Z][a-zéúíóáãõ]+\s*,\s+\d{1,2}\s+de\s+[a-zéúíóáãõ]+\s+de\s+\d{4}',
        r'[A-ZÉÚÍÓÁÃÕÇ\s-]+,\s+\d{1,2}\s+de\s+[A-ZÉÚÍÓÁÃÕÇ][a-zéúíóáãõç]+\s+de\s+\d{4}'
    ]
    
    for pattern in relative_patterns:
        relative_pattern = re.compile(pattern)
        relative_matches = relative_pattern.findall(text)
        
        for match in relative_matches:
            if isinstance(match, tuple) and len(match) == 3:
                value, unit, start_date_str = match
                value = int(value)
                
                try:
                    start_date = parse(start_date_str, dayfirst=True)
                except ValueError:
                    continue
                
                if unit == 'meses':
                    final_date = start_date + relativedelta(months=value)
                elif unit == 'dias':
                    final_date = start_date + timedelta(days=value)
                elif unit == 'anos':
                    final_date = start_date + relativedelta(years=value)
                else:
                    continue
                
                return final_date.strftime('%d/%m/%Y')
            
            elif isinstance(match, str):
                specific_date = match
                
                if re.match(r'[A-Z][a-zéúíóáãõ]+\s+[A-Z][a-zéúíóáãõ]+\s*,\s+\d{1,2}\s+de\s+[a-zéúíóáãõ]+\s+de\s+\d{4}', specific_date):
                    try:
                        parts = specific_date.split(',', 1)[1].strip().split()
                        day = int(parts[0])
                        month_name = parts[2]
                        year = int(parts[4])
                        
                        month = convert_month_name_to_number(month_name)
                        if month is None:
                            continue
                        
                        final_date = parse(f"{month}/{day}/{year}")
                        return final_date.strftime('%d/%m/%Y')
                    
                    except (IndexError, ValueError):
                        continue
                else:
                    try:
                        final_date = parse(specific_date, dayfirst=True)
                        return final_date.strftime('%d/%m/%Y')
                    except ValueError:
                        continue
    
    return None

def return_validity(text):
    # Calcular data relativa se houver
    relative_date = calculate_relative_dates(text)
    
    if relative_date:
        print("Dates processed. Date:" + relative_date)
        return relative_date
    
    # Extrair todas as datas
    all_dates = extract_dates(text)
    
    if not all_dates:
        print("Dates processed. No dates found.")
        return "Nenhuma data encontrada"
    
    # Tentar parsear as datas
    parsed_dates = []
    for date_str in all_dates:
        try:
            parsed_date = parse(date_str, fuzzy=True, dayfirst=True)
            parsed_dates.append(parsed_date)
        except (ValueError, TypeError):
            continue
    
    if not parsed_dates:
        print("Dates processed. No dates found.")
        return "Nenhuma data válida encontrada"
    
    # Se não houver data relativa, retornar a primeira data encontrada
    print("Dates processed. Date: " + parsed_dates[0].strftime('%d/%m/%Y'))
    return parsed_dates[0].strftime('%d/%m/%Y')

# Função para retornar os CNPJs do texto. Se o modo 'preciso/exato' estiver ativado, será utilizado REGEX para verificar se o CNPJ está nos padrões
def return_cnpjs(mode):
    cnpjs = []
    for token in doc:
        if token.text == "CNPJ" or token.text == "CPF":
            count = 1
            while (token.i + count < len(doc)) and (doc[token.i + count].text not in [":", "n", "nº", "n.", "n.º", "nº."]):
                count += 1
            if token.i + count < len(doc):
                desired_token = doc[token.i + count + 1]
                if desired_token.is_space or desired_token.is_punct:
                    if token.i + count + 2 < len(doc):
                        desired_token = doc[token.i + count + 2]
                valid_cnpj = True
                possible_verification_numbers = doc[desired_token.i + 1].text if desired_token.i + 1 < len(doc) else ""
                if mode == "exact":
                    valid_cnpj = validate_info(desired_token.text + possible_verification_numbers, r"([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})")
                if valid_cnpj and len(desired_token.text) > 10:
                    if validate_info(possible_verification_numbers, r"-\w{2}$"):
                        if desired_token.text + possible_verification_numbers not in cnpjs:
                            cnpjs.append(desired_token.text + possible_verification_numbers)
                    else:
                        if desired_token.text not in cnpjs:
                            cnpjs.append(desired_token.text)
    print("CNPJs processed:", cnpjs)
    return cnpjs


# Checar se é número
def is_number(text):
    try:
        float(text.replace('.', '').replace(',', '.'))
        return True
    except ValueError:
        return False

# Função para retornar valores reais no texto. Se o modo 'preciso/exato' estiver ativado, será utilizado REGEX para verificar se o valor real está nos padrões 
def return_real_values(mode):
    real_values = []
    for token in doc:
        if token.text == "R$":
            count = 1
            while (token.i + count < len(doc)) and (doc[token.i + count].is_space or doc[token.i + count].is_punct) and count < 100:
                count += 1
            if token.i + count < len(doc):
                desired_token = doc[token.i + count]
                valid_real_value = True
                if mode == "exact":
                    valid_real_value = validate_info(desired_token.text, r"^(([1-9]\d{0,2}(\.\d{3})*)|(([1-9]\.\d*)?\d))(\,\d\d)?$")
                if valid_real_value and (is_number(desired_token.text) or desired_token.text.startswith("X")):
                    if token.text + " " + desired_token.text not in real_values:
                        real_values.append(token.text + " " + desired_token.text)
    print("Real values processed: " , real_values)                    
    return real_values


# Função que retorna as classificações do texto, como um objeto. Ela utiliza o nosso modelo customizado para classificações
def return_cats(text):
    model_path = os.path.abspath("./ai/training/model_contracts")
    cats_nlp = spacy.load(model_path)
    cats_doc = cats_nlp(text)
    print("Cats processed: ", cats_doc.cats)    
    return cats_doc.cats