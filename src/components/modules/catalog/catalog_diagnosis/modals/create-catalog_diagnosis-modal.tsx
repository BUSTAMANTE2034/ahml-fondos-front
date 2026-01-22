import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/forms/input'
import { useDiagnosisCatalog } from '../index/catalog_diagnosis-context'

import { CreateDiagnosisCatalog } from '@/lib/api/models/diagnosis_catalog'
import { DIAGNOSIS_CONCEPTS } from '@/components/ui/functions'

const CreateDiagnosisCatalogModal = () => {
  const {
    isCreateOpen,
    closeCreate,
    handleCreate,
    loadingCreate,
  } = useDiagnosisCatalog()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDiagnosisCatalog>({
    defaultValues: {
      concept: '',
      detail: '',
      description: '',
    },
  })

  const onSubmit = async (data: CreateDiagnosisCatalog) => {
    await handleCreate(data)
    reset()
  }

  if (!isCreateOpen) return null

  return (
    <Modal visible onClose={closeCreate}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Crear diagnóstico
          </h2>
          <p className="text-sm">
            Registra un nuevo concepto de diagnóstico.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          {/* CONCEPTO (SELECT FIJO) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">
              Concepto
            </label>

            <select
              {...register('concept', {
                required: 'Concepto obligatorio',
              })}
              className="text-xs px-3 py-2 rounded-3xl border border-gray-2
                         focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecciona un concepto</option>
              {DIAGNOSIS_CONCEPTS.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>

            {errors.concept && (
              <span className="text-xs text-red-500 px-1">
                {errors.concept.message}
              </span>
            )}
          </div>

          {/* DETALLE */}
          <FormInput
            name="detail"
            label="Detalle"
            placeholder="Detalle del diagnóstico"
            register={register}
            errors={errors}
            rules={{ required: 'Detalle obligatorio' }}
          />

          {/* DESCRIPCIÓN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm  font-bold px-1">
              Descripción (opcional)
            </label>

            <textarea
              {...register('description')}
              rows={3}
              placeholder="Descripción adicional"
              className="text-xs px-3 py-2 rounded-xl border border-gray-2
                         focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* BUTTONS */}
          {loadingCreate ? (
            <div className="flex items-center justify-center gap-4 py-4">
              <span className="text-blue-600 font-medium">
                Creando...
              </span>
              <Loader size={20} />
            </div>
          ) : (
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={closeCreate}
                className="cancel"
              >
                <span>Cancelar</span>
                
              </button>

              <button type="submit" className="create">
                <span>Guardar</span>
                
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default CreateDiagnosisCatalogModal
