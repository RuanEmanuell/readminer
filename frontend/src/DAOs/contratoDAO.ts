class ContratoDAO {
    private db: IDBDatabase | null = null;

    constructor(private dbName: string, private dbVersion: number) {
        this.openDatabase();
    }

    public openDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains("meusDados")) {
                    const objectStore = db.createObjectStore("meusDados", { autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                console.log("Banco de dados aberto com sucesso.");
                resolve();
            };

            request.onerror = (event) => {
                console.log("Erro ao abrir o banco de dados:", (event.target as IDBOpenDBRequest).error);
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    public adicionarDado(dado: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error("Banco de dados não está aberto.");
                reject("Banco de dados não está aberto.");
                return;
            }

            const transaction = this.db.transaction(["meusDados"], "readwrite");
            const objectStore = transaction.objectStore("meusDados");
            const request = objectStore.add(dado);

            request.onsuccess = () => {
                console.log("Dado adicionado com sucesso:", dado);
                resolve();
            };

            request.onerror = (event) => {
                console.log("Erro ao adicionar dado:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    }

    public lerDado(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error("Banco de dados não está aberto.");
                reject("Banco de dados não está aberto.");
                return;
            }

            const transaction = this.db.transaction(["meusDados"], "readonly");
            const objectStore = transaction.objectStore("meusDados");
            const request = objectStore.get(id);

            request.onsuccess = (event) => {
                if ((event.target as IDBRequest).result) {
                    console.log("Dado lido com sucesso:", (event.target as IDBRequest).result);
                    resolve((event.target as IDBRequest).result);
                } else {
                    console.log("Dado não encontrado.");
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                console.log("Erro ao ler dado:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    }

    public lerTodosDados(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error("Banco de dados não está aberto.");
                reject("Banco de dados não está aberto.");
                return;
            }

            const transaction = this.db.transaction(["meusDados"], "readonly");
            const objectStore = transaction.objectStore("meusDados");
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                //console.log("Dados lidos com sucesso:", (event.target as IDBRequest).result);
                resolve((event.target as IDBRequest).result);
            };

            request.onerror = (event) => {
                console.log("Erro ao ler dados:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    }

    public atualizarDado(dado: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error("Banco de dados não está aberto.");
                reject("Banco de dados não está aberto.");
                return;
            }

            const transaction = this.db.transaction(["meusDados"], "readwrite");
            const objectStore = transaction.objectStore("meusDados");
            const request = objectStore.put(dado);

            request.onsuccess = () => {
                console.log("Dado atualizado com sucesso:", dado);
                resolve();
            };

            request.onerror = (event) => {
                console.log("Erro ao atualizar dado:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    }

    public deletarDado(id: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error("Banco de dados não está aberto.");
                reject("Banco de dados não está aberto.");
                return;
            }

            const transaction = this.db.transaction(["meusDados"], "readwrite");
            const objectStore = transaction.objectStore("meusDados");
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log("Dado deletado com sucesso. ID:", id);
                resolve();
            };

            request.onerror = (event) => {
                console.log("Erro ao deletar dado:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    }

    public buscarPorNomeArquivo(nomeArquivo: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error("Banco de dados não está aberto.");
                reject("Banco de dados não está aberto.");
                return;
            }

            const transaction = this.db.transaction(["meusDados"], "readonly");
            const objectStore = transaction.objectStore("meusDados");
            const request = objectStore.openCursor();
            const resultados: any[] = [];

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    if (cursor.value.nomeArquivo.includes(nomeArquivo)) {
                        resultados.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    console.log("Busca concluída. Resultados encontrados:", resultados);
                    resolve(resultados);
                }
            };

            request.onerror = (event) => {
                console.log("Erro ao buscar dado:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    }

}


const contratoDAO = new ContratoDAO("contratos", 1)
export default contratoDAO