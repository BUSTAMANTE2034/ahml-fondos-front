import { useEffect, useState } from 'react'
import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useVisitors } from '../index/visitor-context'

const DeleteVisitorModal = () => {
  const { 
    isDeleteOpen, 
    selected, 
    closeDelete, 
    handleDelete, 
    loadingDelete 
  } = useVisitors()

  const [inputValue, setInputValue] = useState('')

  // Reset input cuando se abre el modal
  useEffect(() => {
    if (isDeleteOpen && selected) {
      setInputValue('')
    }
  }, [isDeleteOpen, selected])

  if (!isDeleteOpen || !selected) return null

  // Palabra requerida para habilitar el botón
  const REQUIRED = 'Eliminar'
  const isMatch = inputValue.trim() === REQUIRED

  return (
    <Modal visible onClose={closeDelete}>
      <div className="flex flex-col gap-4 px-2 md:px-4 text-center">

        {/* ENCABEZADO */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Eliminar Visitante
          </h2>
          <p className="text-sm">
            Para confirmar la eliminación <strong>{selected.first_name}</strong>, escribe{' '}
            <strong>"{REQUIRED}"</strong>.
          </p>
        </div>

        {/* INPUT DE CONFIRMACIÓN */}
        <input
          type="text"
          placeholder={REQUIRED}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input2"
        />

        {/* LOADING */}
        {loadingDelete && (
          <div className="flex items-center justify-center mx-auto gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Eliminando...
            </span>
            <Loader size={20} />
          </div>
        )}

        {/* BOTONES */}
        {!loadingDelete && (
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={closeDelete} className="cancel">
              <span>Cancelar</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={!isMatch}
              className={`delete ${!isMatch ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Eliminar</span>
            </button>
          </div>
        )}

      </div>
    </Modal>
  )
}

export default DeleteVisitorModal
