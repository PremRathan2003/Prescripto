import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

import adminBg from '../assets/admin-bg.jpg'
import doctorBg from '../assets/doctor-bg.jpg'

import { ShieldCheck, Stethoscope } from 'lucide-react'

const Login = () => {

  const [state, setState] = useState("Admin")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });

        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success("Admin login successful");
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });

        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          toast.success("Doctor login successful");
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error("Login failed");
    }
  }

  return (
    
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${state === 'Admin' ? adminBg : doctorBg})`
      }}
    >
      {/* ✅ Dark overlay */}
      <div className="bg-black/50 absolute inset-0"></div>

      {/* ✅ Glass blur card */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 flex flex-col gap-4 items-start p-8 min-w-[340px] sm:min-w-96 rounded-2xl text-[#5E5E5E] text-sm shadow-2xl bg-white/20 backdrop-blur-xl border border-white/30 transition-all duration-500"
      >
        <p className='text-2xl font-semibold m-auto flex items-center gap-2 text-white'>
          {state === "Admin" ? <ShieldCheck /> : <Stethoscope />}
          <span>{state} Login</span>
        </p>

        <div className='w-full'>
          <p className="text-white">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-white/40 bg-white/80 rounded w-full p-2 mt-1 focus:outline-none'
            type="email"
            required
          />
        </div>

        <div className='w-full'>
          <p className="text-white">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-white/40 bg-white/80 rounded w-full p-2 mt-1 focus:outline-none'
            type="password"
            required
          />
        </div>

        <button className='bg-[#5F6FFF] hover:bg-[#4958ff] transition-all text-white text-base w-full py-2 rounded-md'>
          Login
        </button>

        {
          state === "Admin" ?
            <p className="text-white">
              Doctor Login?{' '}
              <span
                className='text-blue-300 underline cursor-pointer'
                onClick={() => setState('Doctor')}
              >
                Click here
              </span>
            </p>
            :
            <p className="text-white">
              Admin Login?{' '}
              <span
                className='text-blue-300 underline cursor-pointer'
                onClick={() => setState('Admin')}
              >
                Click here
              </span>
            </p>
        }
      </form>
      <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs p-4 rounded-xl shadow-lg border border-white/20 max-w-[220px]">
  <p className="font-semibold mb-2 text-sm">Demo Credentials</p>

  {state === "Admin" ? (
    <>
      <p><span className="font-medium">Admin Email:</span> admin@prescripto.com</p>
      <p><span className="font-medium">Password:</span> qwerty123</p>
    </>
  ) : (
    <>
      <p><span className="font-medium">Doctor Email:</span> doctorname@prescripto.com</p>
      <p><span className="font-medium">Password:</span> qwert123</p>
    </>
  )}
</div>
    </div>
  )
}

export default Login
