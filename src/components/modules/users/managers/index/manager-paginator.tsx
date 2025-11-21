
import After from '@icons/next.svg';
import Before from '@icons/preview.svg';
import { IconButton } from '@ui/iconButton'
import { useManagers } from './manager-context';

const ManagersPaginator = () => {
  const {
    current_page,
    pages,
    hasPrev,
    hasNext,
    goPrev,
    goNext,
    loadingGet:loading,   
  } = useManagers();

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

      <span className="bg-main-gray border  border-dark-gray text-black-3
        hover:bg-white rounded-lg text-xs md:text-sm font-semibold px-3 py-1">
        {current_page?? 1} <span className='text-black-0 dark:text-tgray'>/</span> {pages ?? '—'}
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

export default ManagersPaginator;
