import { useEffect, useState, ChangeEvent } from "react";
import contratoDAO from "../DAOs/contratoDAO";
import { FilePdf, MagnifyingGlass } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function Busca() {
    const [contratos, setContratos] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [contractsPerPage] = useState(4); // Número de contratos por página
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");

    useEffect(() => {
        contratoDAO
            .lerTodosDados()
            .then((result) => {
                setContratos(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    function verResultado(result: any) {
        navigate("/resultado", { state: { result } });
    }

    function handleBusca(e: React.ChangeEvent<HTMLInputElement>) {
        setBusca(e.target.value);
    }

    function enviarBusca() {
        contratoDAO.buscarPorNomeArquivo(busca).then((result) => {
            setContratos(result);
            setCurrentPage(1); // Resetar para a primeira página após a busca
        })
            .catch((e) => {
                console.log(e.message);
            });
    }

    // Funções para mudar de página
    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(contratos.length / contractsPerPage)));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // Calcular contratos para a página atual
    const indexOfLastContract = currentPage * contractsPerPage;
    const indexOfFirstContract = indexOfLastContract - contractsPerPage;
    const currentContracts = contratos.slice(indexOfFirstContract, indexOfLastContract);

    const totalPages = Math.ceil(contratos.length / contractsPerPage);

    return (
        <div className="w-full min-h-screen flex flex-col justify-between">
            <div className="xl:px-40">
                <div className="flex justify-center items-center gap-2 mt-4 mb-6">
                    <input
                        type="text"
                        className="bg-[#F9F9F9] h-12 w-full rounded-md px-3 sm:text-lg text-xs"
                        onChange={handleBusca}
                        value={busca}
                        placeholder="Busque um nome de arquivo"
                    />
                    <button onClick={enviarBusca} className="flex items-center justify-center gap-2 bg-[#0669b2] h-11 px-4 text-white rounded-md">
                        <MagnifyingGlass size={23} weight="fill" />
                        <p>Buscar</p>
                    </button>
                </div>

                {currentContracts.map((contrato, index) => {
                    const possiveisResultados: number[] = []
                    possiveisResultados.push(contrato.contrato.cats.aluguel)
                    possiveisResultados.push(contrato.contrato.cats.confidencialidade)
                    possiveisResultados.push(contrato.contrato.cats.parceria)
                    possiveisResultados.push(contrato.contrato.cats.prestacao_servico)
                    possiveisResultados.push(contrato.contrato.cats.venda_compra)

                    var maiorValor: number = 0;

                    for (let i = 0; i < possiveisResultados.length; i++) {
                        if (possiveisResultados[i] > maiorValor) {
                            maiorValor = possiveisResultados[i]
                        }
                    }

                    let classificacao: string = ""
                    switch (maiorValor) {
                        case contrato.contrato.cats.aluguel: {
                            classificacao = "Aluguel"
                            break
                        }
                        case contrato.contrato.cats.confidencialidade: {
                            classificacao = "Confidencialidade"
                            break
                        }
                        case contrato.contrato.cats.parceria: {
                            classificacao = "Parceria"
                            break
                        }
                        case contrato.contrato.cats.prestacao_servico: {
                            classificacao = "Prestação de serviço"
                            break
                        }
                        case contrato.contrato.cats.venda_compra: {
                            classificacao = "Venda ou Compra"
                            break
                        }
                    }

                    return (
                        <div
                            onClick={() => verResultado(contrato)}
                            className="flex flex-row w-full sm:gap-6 gap-3 items-center border border-gray-300 bg-[#F9F9F9] py-3 sm:px-3 px-2 mt-4 text-gray-800 text-md rounded-md shadow-sm hover:bg-[#efeef4] transition-colors duration-300 cursor-pointer"
                            key={index}
                        >
                            <FilePdf size={80} className="text-red-600"></FilePdf>
                            <div>
                                <p className="text-md sm:text-xl font-semibold sm:mb-1 mb-3">{`${contrato.nomeArquivo}`}</p>
                                <div className="flex gap-1">
                                    <p className="text-xs sm:text-xl">{`Classificação: `}</p>
                                    <p className="text-[#0669b2] text-xs sm:text-xl font-semibold">{classificacao}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center fixed bottom-0 left-0 w-full bg-white py-4 sm:px-28 lg:px-96 px-4 border-t border-gray-300">
                    <button onClick={prevPage} disabled={currentPage === 1} className="py-2 px-4 bg-[#0669b2] text-white md:text-lg text-sm rounded-[10px]">
                        Anterior
                    </button>
                    <span className="text-md">Página {currentPage} de {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="py-2 px-4 bg-[#0669b2] text-white md:text-lg text-sm rounded-[10px]">
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
