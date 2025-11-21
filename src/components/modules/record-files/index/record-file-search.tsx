import X from '@icons/close.svg'
import Search from '@icons/search.svg'
import { IconButton } from '@ui/iconButton'
import { useRecordFiles } from './record-file-context.js'

const SearchRecordFiles = () => {
  const { queryInput, setQuery } = useRecordFiles()

  return (
    <div className="relative w-full max-w-60 flex items-center">
      <input
        type="text"
        value={queryInput}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar"
        className={`w-full border-b h-8 px-2 text-sm focus:outline-none focus:border-blue-600  focus:ring-0 border-dark-gray2  ${
          queryInput
            ? 'text-black '
            : 'text-dark2-gray '
        }`}
      />

      {queryInput ? (
        <IconButton onClick={() => setQuery('')} tooltip="Limpiar">
          <img src={X} alt="Cerrar" className="icon-size" />
        </IconButton>
      ) : (
        <IconButton tooltip="Buscar">
          <img src={Search} alt="Buscar" className="icon-size" />
        </IconButton>
      )}
    </div>
  )
}

export default SearchRecordFiles
