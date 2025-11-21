import { useNavigate } from 'react-router-dom'
import { IconButton } from '@ui/iconButton'
import Output from '@icons/output.svg'

export default function NotFound() {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center flex-col  ">
      <h1 className="font-extrabold text-6xl text-brown-5">
        404
      </h1>
      <span className="text-2xl font-bold text-brown-3">
        ¡Página no encontrada!
      </span>
      <span className=" text-sm md:text-base mb-4 ">
        Al parecer no fue posible encontrar la página. Intenta mas tarde
      </span>

      <IconButton
        className="flex flex-col text-center items-center"
        onClick={goBack}
      >
        <img src={Output} alt="Home Icon" className="icon-size" />
        <span className="text-[10px] sm:text-sm font-medium ">
          Regresar
        </span>
      </IconButton>
    </div>
  )
}
