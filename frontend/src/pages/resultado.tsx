import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CaretCircleLeft } from "@phosphor-icons/react";

export default function Resultado() {
    const { state } = useLocation();
    const [maiorValor, setMaiorValor] = useState<number>(0)
    const [classificacao, setClassificacao] = useState<string>("")
    const [contractantLabel, setContractantLabel] = useState<string>("Contratante");
    const [contractorLabel, setContractorLabel] = useState<string>("Contratado");
    const result = state?.result; // Obtém o resultado do estado
    const navigate = useNavigate();

    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        //console.log(`NOME: ${result.nomeArquivo}`)

        /*if (result && result.arquivo) {
            const blob = new Blob([result.arquivo], { type: 'application/pdf' });
            setPdfUrl(URL.createObjectURL(blob));
        }*/

        const possiveisResultados: number[] = []
        possiveisResultados.push(result.contrato.cats.aluguel)
        possiveisResultados.push(result.contrato.cats.confidencialidade)
        possiveisResultados.push(result.contrato.cats.parceria)
        possiveisResultados.push(result.contrato.cats.prestacao_servico)
        possiveisResultados.push(result.contrato.cats.venda_compra)

        for (let i = 0; i < possiveisResultados.length; i++) {
            if (possiveisResultados[i] > maiorValor) {
                setMaiorValor(possiveisResultados[i])
            }
        }

        switch (true) {
            case maiorValor === result.contrato.cats.aluguel: {
                setClassificacao("Aluguel")
                setContractantLabel("Locador")
                setContractorLabel("Locatário")
                break
            }
            case maiorValor === result.contrato.cats.confidencialidade: {
                setClassificacao("Confidencialidade")
                setContractantLabel("Parte 1")
                setContractorLabel("Parte 2")
                break
            }
            case maiorValor === result.contrato.cats.parceria: {
                setClassificacao("Parceria")
                setContractantLabel("Parceiro 1")
                setContractorLabel("Parceiro 2")
                break
            }
            case maiorValor === result.contrato.cats.prestacao_servico: {
                setClassificacao("Prestação de serviço")
                setContractantLabel("Contratante")
                setContractorLabel("Contratado")
                break
            }
            case maiorValor === result.contrato.cats.venda_compra: {
                setClassificacao("Venda ou Compra")
                setContractantLabel("Comprador")
                setContractorLabel("Vendedor")
                break
            }
        }
    }, [result, maiorValor])

    return (
        <>
            <button
                onClick={() => navigate("/busca")} // Navega para a página de busca
                className="absolute sm:top-24 top-20 mt-1 sm:mt-0 sm:left-4 left-2 flex items-center gap-2 bg-[#0669b2] h-11 px-4 text-white rounded-md"
            >
                <CaretCircleLeft size={23} weight="fill" />
                <p>Página de Busca</p>
            </button>

            <h1 className="sm:text-2xl text-lg text-black font-bold lg:mt-4 mt-24">RESULTADO</h1>
            <div className="flex flex-row justify-center gap-2 items-center mt-3">
                <h2 className="sm:text-xl text-[12px] text-black">O Documento se classifica como: </h2>
                <p className="sm:text-xl text-[12px] text-[#0669b2] font-semibold">{classificacao}</p>
            </div>

            <div className="flex lg:gap-6 w-full lg:flex-row flex-col justify-center lg:items-stretch items-center">
                <div className="bg-[#F9F9F9] hover:bg-[#efeef4] flex flex-1 flex-col border-2 border-gray-300 p-3 py-5 rounded-md xl:w-1/3 lg:w-3/4 w-full gap-4 sm:mt-8 mt-4">
                    <p className="sm:text-xl text-sm">{`Nome do Arquivo: ${result.nomeArquivo}`}</p>
                    <p className="sm:text-xl text-sm">{`CNPJs/CPFs: ${result.contrato.cnpjs.length > 0 ? result.contrato.cnpjs.join(', ') : 'Nenhum CNPJ ou CPF encontrado'}`}</p>
                </div>
                <div className="bg-[#F9F9F9] hover:bg-[#efeef4] flex flex-1 flex-col border-2 border-gray-300 p-3 py-5 rounded-md xl:w-1/3 lg:w-3/4 w-full  gap-4 sm:mt-8 mt-4">
                    <p className="sm:text-xl text-sm">{`${contractantLabel}: ${result.contrato.contractant}`}</p>
                    <p className="sm:text-xl text-sm">{`${contractorLabel}: ${result.contrato.contractor}`}</p>
                </div>
                <div className="bg-[#F9F9F9] hover:bg-[#efeef4] flex flex-1 flex-col border-2 border-gray-300 p-3 py-5 rounded-md xl:w-1/3 lg:w-3/4 w-full  gap-4 sm:mt-8 mt-4">
                    <p className="sm:text-xl text-sm" style={{ flexDirection: 'column' }}>{`Valores monetários: ${result.contrato.real_values.length > 0 ? result.contrato.real_values.join(', ') : 'Nenhum valor monetário encontrado'}`}</p>
                </div>
            </div>

            <p className="sm:text-xl text-[13px] sm:mt-8 mt-6">{`Data de vigência do contrato: ${result.contrato.date}`}</p>

            {/*<iframe
                src={pdfUrl}
                width="100%"
                height="500px"
                title="PDF Viewer"
            ></iframe>*/}
        </>
    )
}
