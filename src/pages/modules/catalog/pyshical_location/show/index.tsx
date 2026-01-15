import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '@ui/card'

const PhysicalLocationShowPage = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Expediente escaneado
          </h2>
        </CardHeader>

        <CardBody className="flex flex-col gap-6 text-center">
          <p className="text-base text-gray-600">
            El expediente escaneado se encuentra en la estantería:
          </p>

          {/* CÓDIGO PROTAGONISTA */}
          <div className="py-6 px-4 border-2 border-dashed border-blue-500 rounded-2xl bg-blue-50">
            <span className="text-3xl md:text-4xl font-extrabold tracking-widest text-blue-700">
              {code}
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Verifica el código en la estantería correspondiente.
          </p>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate(-1)}
              className="cancel"
            >
              <span>Volver</span>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PhysicalLocationShowPage
