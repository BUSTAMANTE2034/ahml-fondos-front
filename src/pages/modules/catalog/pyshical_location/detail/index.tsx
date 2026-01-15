import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '@ui/card'
import Loader from '@ui/loader'

import { useGetPhysicalLocationDetail } from '@/lib/api/hooks/catalog/physical_locations'

interface ClassificationCodesTableProps {
  codes: string[]
}

const ClassificationCodesTable = ({ codes }: ClassificationCodesTableProps) => {
  if (!codes.length) return null

  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-semibold text-blue-600">
              Código de clasificación archivística
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {codes.map((code, idx) => (
            <tr
              key={idx}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-3 py-2 text-sm font-mono text-gray-700">
                {code}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



const PhysicalLocationDetailPage = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  const {
    location,
    boxes,
    summary,
    loading,
    error,
  } = useGetPhysicalLocationDetail({
    code,
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader size={32} />
      </div>
    )
  }

  if (error || !location) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <Card className="max-w-xl w-full">
          <CardBody className="text-center space-y-4">
            <p className="text-red-600 font-medium">
              {error || 'No se pudo cargar la información.'}
            </p>

            <button
              onClick={() => navigate(-1)}
              className="cancel"
            >
              <span>Volver</span>
            </button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Detalle de estantería
          </h2>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">

          {/* CÓDIGO */}
          <div className="text-center">
            <div className="inline-block py-4 px-6 border-2 border-dashed border-blue-500 rounded-2xl bg-blue-50">
              <span className="text-3xl md:text-4xl font-extrabold tracking-widest text-blue-700">
                {location.code}
              </span>
            </div>

            {location.description && (
              <p className="mt-2 text-gray-600">
                {location.description}
              </p>
            )}
          </div>

          {/* RESUMEN */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl bg-main-gray border">
              <p className="text-sm text-gray-500">Cajas</p>
              <p className="text-2xl font-bold text-blue-600">
                {summary?.total_boxes ?? 0}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-main-gray border">
              <p className="text-sm text-gray-500">Expedientes</p>
              <p className="text-2xl font-bold text-blue-600">
                {summary?.total_record_files ?? 0}
              </p>
            </div>
          </div>

          {/* LISTA DE CAJAS */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-600">
              Cajas en esta estantería
            </h3>

            {boxes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No hay cajas registradas en esta estantería.
              </p>
            ) : (
              boxes.map((box:any) => (
                <div
                  key={box.id}
                  className="border rounded-2xl p-4 bg-white flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      Caja {box.box_number}
                    </span>

                    <span className="text-sm text-gray-500">
                      {box.total_record_files} expedientes
                    </span>
                  </div>

                  {box.description && (
                    <p className="text-sm text-gray-600">
                      {box.description}
                    </p>
                  )}

                  {box.classification_codes.length > 0 && (
  <div>
  
    <ClassificationCodesTable
      codes={box.classification_codes}
    />
  </div>
)}
                </div>
              ))
            )}
          </div>

          {/* BOTÓN */}
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

export default PhysicalLocationDetailPage
