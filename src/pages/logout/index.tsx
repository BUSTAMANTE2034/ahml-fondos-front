import Loader from '@ui/loader'
 const LogoutScreen=()=> {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-linear-to-b  from-blue-800 via-blue-400 to-white p-10 ">
      <Loader
        size={100}
        label='Cerrando sesión'
        className="text-4xl!  font-extrabold text-white! text-shadow-lg!"
      />
    </div>
  )
}
export default LogoutScreen