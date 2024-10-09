interface PropsCard {
    titulo: string,
    texto: string,
    icone: React.ElementType,
    altIcone: string
}

export default function Card({ titulo, texto, icone: IconComponent, altIcone }: PropsCard) {
    return (
        <div className="group flex xl:flex-col flex-1 items-center bg-[#F9F9F9] py-6 sm:px-4 mt-4 text-gray-800 rounded-xl hover:bg-blue-900 hover:text-white transition-colors duration-300 cursor-pointer">
            <IconComponent aria-label={altIcone} size={80} className="hidden sm:block text-[#0669b2] transition-colors duration-300 group-hover:text-white" />
            <div className="flex flex-col items-center">
                <p className="sm:text-2xl text-lg font-medium sm:mt-4 ">{titulo}</p>
                <p className="mt-2 text-center text-sm sm:w-96 mx-6 xl:mx-0 xl:w-auto">{texto}</p>
            </div>

        </div>
    )
}