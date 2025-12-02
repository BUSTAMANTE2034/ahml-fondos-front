const VERSION = import.meta.env.VITE_VERSION
const Footer = () => {
  return (
    <footer className="w-full p-1 text-right relative">
      <p className=" text-gray-4 italic text-[10px]">Desarrollador - Bustamante Servin Carlos Eduardo v-{VERSION}</p>
    </footer>
  )
}
export default Footer
