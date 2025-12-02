import AHML from '@images/ahml-big-brown.svg'
const Branding = () => {
  return (
      <div className="flex flex-col  items-center justify-center gap-10">
        <h1 className="flex w-full  flex-col uppercase font-bold text-4xl md:text-6xl text-center md:mt-0 mt-10 gap-4 text-shadow ">
          <span>Fondos</span>
          <span>Documentales</span>
        </h1>
        <img src={AHML} alt="AHML"  className='w-[80%] h-[80%] md:flex hidden'/>
      </div>
  )
}
export default Branding
