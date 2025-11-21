import Escudo from '@images/escudo-big.svg'
import AHML from '@images/ahml-big-brown.svg'
const Header = () => {
  return (
    <div className="flex text-3xl relative  w-full items-center justify-between p-4 text-white">
        <img src={AHML} alt="AHML" className="md:hidden h-20 w-20 md:h-30 md:w-30" />
        <img src={Escudo} alt="Escudo León Gto" className="h-20 w-20 md:h-30 md:w-30 ml-0 md:ml-auto" />
    </div>
  )
}
export default Header
