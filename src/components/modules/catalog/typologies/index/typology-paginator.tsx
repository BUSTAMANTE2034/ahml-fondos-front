
import After from '@icons/next.svg';
import Before from '@icons/preview.svg';
import { IconButton } from '@ui/iconButton'
import { useTypologies } from './typology-context.js';

const TypologysPaginator = () => {
  const {
    current_page,
    pages,
    hasPrev,
    hasNext,
    goPrev,
    goNext,
    loadingGet:loading,   
    totalItems,
  } = useTypologies();

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
    flex items-center gap-3
    bg-blue-100/50 border border-blue-300
    hover:bg-white
    rounded-lg
    text-xs md:text-sm font-semibold
    px-3 py-1
  "
      >
        {/* Página */}
        <span className="text-black-3">
          Página
          <span className="mx-1 font-bold text-blue-700">
            {current_page ?? 1}
          </span>
          de
          <span className="ml-1 font-bold text-blue-700">{pages ?? '—'}</span>
        </span>

        {/* Separador */}
        {totalItems !== undefined && (
          <>
            <span className="h-3 w-px bg-blue-300/60" />

            {/* Items */}
            <span className="text-black-0 dark:text-tgray font-medium">
              <span className="font-bold text-blue-700">
                {(current_page ?? 1) * 20 > totalItems
                  ? totalItems
                  : (current_page ?? 1) * 20}
              </span>
              <span className="mx-1">/</span>
              <span className="font-bold text-blue-600">{totalItems}</span>
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

export default TypologysPaginator;
