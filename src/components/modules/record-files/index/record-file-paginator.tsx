
import After from '@icons/next.svg';
import Before from '@icons/preview.svg';
import { IconButton } from '@ui/iconButton'
import { useRecordFiles } from './record-file-context.js';

const RecordFilesPaginator = () => {
  const {
    current_page,
    pages,
    hasPrev,
    hasNext,
    goPrev,
    goNext,
    loadingGet:loading,  
    totalItems 
  } = useRecordFiles();

  const prevDisabled = loading || !hasPrev;
  const nextDisabled = loading || !hasNext;

  return (
    <div className="flex justify-center items-center gap-2 ">
      <IconButton
       className='w-6! h-6! p-[7px]!'
        onClick={goPrev}
        disabled={prevDisabled}
        tooltip='Anterior'
        tooltipPoss='top'
      >
        <img src= {Before} alt="Anterior" className='icon-size'/>
      </IconButton>

     <span
  className="
    flex items-center gap-2
    bg-blue-100/50 border border-blue-300
    hover:bg-white
    rounded-lg
    text-xs md:text-sm font-semibold
    px-3 py-1
  "
>
  {/* Página actual */}
  <span className="text-black-3">
    {current_page ?? 1}
    <span className="mx-1 text-black-0 dark:text-tgray">/</span>
    {pages ?? '—'}
  </span>

  {/* Separador */}
  {totalItems !== undefined && (
    <>

      {/* Total */}
      <span className="text-black-0 dark:text-tgray font-medium">
        {/* Total */}
        <span className="ml-1 font-bold text-blue-600 bg-blue-100/50 border border-blue-200 px-1 rounded">
          {totalItems}
        </span>
      </span>
    </>
  )}
</span>


      <IconButton
        className='w-6! h-6! p-[7px]!'
        onClick={goNext}
        disabled={nextDisabled}
        tooltip='Siguiente'
        tooltipPoss='top'
      >
        <img src={After} alt="Siguiente" />
      </IconButton>
    </div>
  );
};

export default RecordFilesPaginator;
