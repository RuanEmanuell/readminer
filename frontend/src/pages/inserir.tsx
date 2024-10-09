import { ChangeEvent, useEffect, useState } from "react";
import contratoDAO from "../DAOs/contratoDAO";
import CustomSwitch from "../components/switch";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";
import { ChartLineUp, ClockCounterClockwise, FileArrowUp, Lightning } from "@phosphor-icons/react";
import ErrorMessageBox from "../components/error";
import Loading from "../components/loading";

export default function Inserir() {
    const [fileName, setFileName] = useState("");
    const [analysisMode, setAnalysisMode] = useState("default");
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function submitArquivo(e: ChangeEvent<HTMLInputElement>) {
        setLoading(true);

        const file = e.target.files![0];
        const formData = new FormData();

        formData.append("file", file);
        formData.append("mode", analysisMode);

        setFileName(file.name);

        try {
            const response = await fetch('https://granto-backend.onrender.com/post/upload-file', {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = response.status === 400 ? ' erro no envio do arquivo pelo usuário. Tente novamente.' :
                                 response.status === 500 ? ' erro no servidor. Tente novamente mais tarde.' :
                                 ' erro ao enviar arquivo. Status: ' + response.status;
                throw new Error(errorText);
            }

            const contrato = await response.json();

            try {
                // Ler o arquivo como ArrayBuffer
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = async (event) => {
                    try {
                        const arrayBuffer = event.target!.result;

                        // Adicionar o arquivo ao objeto a ser armazenado
                        const result = {
                            nomeArquivo: file.name,
                            contrato: contrato,
                            arquivo: arrayBuffer,
                        };

                        await contratoDAO.adicionarDado(result);
                        console.log("Dado armazenado com sucesso!");
                        navigate('/resultado', { state: { result } });
                    } catch (e: any) {
                        console.error("Erro ao processar arquivo ou armazenar dados:", e.message);
                        setErrorMessage('Ocorreu um erro ao processar o arquivo ou armazenar os dados:' + e.message);
                    }
                };

                fileReader.onerror = (error) => {
                    console.error("Erro ao ler o arquivo:", error);
                    setErrorMessage('Ocorreu um erro ao ler o arquivo:');
                };
            } catch (e: any) {
                console.error("Erro ao ler o arquivo:", e.message);
                setErrorMessage('Ocorreu um erro ao ler o arquivo:' + e.message);
            }
        } catch (e: any) {
            console.error("Erro ao processar a sua solicitação:", e.message);
            setErrorMessage('Ocorreu um erro ao processar a sua solicitação:' + e.message);
        }
        setLoading(false);
    }

    function switchAnalysisMode() {
        setAnalysisMode(prev => prev === "default" ? "exact" : "default");
    }

    useEffect(() => {
        if (errorMessage !== "") {
            setTimeout(() => {
                if(errorMessage !== ""){
                    setErrorMessage("");
                }
            }, 10000)
            setFileName("");
        }
    }, [errorMessage]);

    return (
        <>
            <div className="md:fixed md:right-4 md:left-auto self-end my-4 w-max flex md:flex-col-reverse gap-2 md:gap-0 items-center justify-center" title="Quando o modo exato está ativado, a IA validará todas as informações. Exemplo: Apenas retornará CNPJs válidos. Quando desligado, a IA usará apenas o contexto do texto para retornar as informações. O melhor modo para se usar depende do quão bem os seus estão formatados.">
                <p className="text-center my-2">Modo exato</p>
                <CustomSwitch mode={analysisMode} onClick={switchAnalysisMode} />
            </div>

            <h1 className="font-bold text-2xl 2xl:text-4xl md:mt-4 mt-2">Análise de contratos</h1>
            <p className="mt-2 2xl:text-2xl sm:text-xl text-center text-md">Visualize informações sobre seu contrato, de forma rápida e fácil</p>
            <div className="xl:flex flex-row 2xl:mt-16 2xl:text-xl 2xl:h-80 xl:mt-6 sm:mb-0 mb-44 mt-4 gap-10 justify-center">
                <Card titulo="Automação" texto="Obtenha dados contratuais utilizando Inteligência Artificial, reduzindo o tempo necessário para a análise inicial dos documentos." icone={Lightning} altIcone="Icone de um raio"></Card>
                <Card titulo="Eficiência operacional" texto="Aumente a eficiência da sua empresa na análise de contratos, minimizando erros humanos e otimizando o processo de revisão." icone={ChartLineUp} altIcone="Icone de um gráfico de linha subindo"></Card>
                <Card titulo="Histórico Completo" texto="Acesse facilmente um histórico detalhado de contratos e suas análises para melhor acompanhamento e referência." icone={ClockCounterClockwise} altIcone="Icone de um relógio"></Card>
            </div>
            <div className="fixed bottom-0 flex flex-col items-center bg-white">
                <button className="bg-[#0669b2] flex items-center justify-center gap-4 font-bold py-4 sm:px-20 px-16 text-white text-xl rounded-md shadow-md hover:bg-[#3b0f8c] transition-colors duration-300 cursor-pointer" onClick={() => document.getElementById('file-upload')!.click()}>
                    <FileArrowUp alt="Icone de um arquivo sendo enviado" size={50}></FileArrowUp>
                    <p className="sm:text-2xl text-xl text-medium text-white">Enviar Arquivo</p>
                    <input id="file-upload" type="file" accept=".pdf" onChange={submitArquivo} className="hidden" />
                </button>


                {!fileName
                    ? <p className="mt-2 mb-4">Só aceitamos PDF, por enquanto.</p>
                    : <p className="mt-2 mb-4">Arquivo enviado: {fileName}</p>
                }
            </div>
            {errorMessage !== "" ?
                <div onClick={() => setErrorMessage("")}>
                    <ErrorMessageBox message={errorMessage} />
                </div>
                : <></>}
            {loading ? <Loading/> : <></>}
        </>
    )
}
