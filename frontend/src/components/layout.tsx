import { useState } from "react"
import { Link } from "react-router-dom"
import logoReadMiner from "../images/logoReadMiner.png"

export default function Layout({ children }: { children: React.ReactNode }) {
    const [mudouPagina, setMudouPagina] = useState(false)

    function trocarBotao() {
        setMudouPagina(!mudouPagina)
    }

    return (
        <>
            <header className="w-full h-16 bg-[#0669b2] flex items-center mx-auto">
                <img src={logoReadMiner} alt="ReadMiner Logo" className="h-10 w-auto ml-3" />
                {mudouPagina
                    ? <button className="ml-auto mr-4" onClick={trocarBotao}>
                        <Link to={'/'} className="bg-[#0CD2AB] text-white font-semibold p-2 px-6 rounded-[10px] shadow-md hover:bg-[#44bda9] transition-colors duration-300">Enviar Contrato</Link>
                    </button>

                    : <button className="ml-auto mr-4" onClick={trocarBotao}>
                        <Link to={'/busca'} className="bg-[#0CD2AB] text-white font-semibold p-2 px-6 rounded-[10px] shadow-md hover:bg-[#44bda9] transition-colors duration-300">Ver Contratos</Link>
                    </button>
                }
            </header>

            <main className="flex items-center flex-col 2xl:px-800 xl:px-48 lg:px-28 md:px-20 px-6">
                {children}
            </main>
        </>
    )
}