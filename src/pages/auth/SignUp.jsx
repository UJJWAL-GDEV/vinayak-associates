import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import logo from "../assets/logo.jpeg"
const SignUp = () => {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch('https://vehicle-node.onrender.com/backend/api/v1/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setError(null);
      navigate('/')
      
      console.log(data);
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto border mt-16'>
      <h1 className='text-3xl text-center font-semibold my-7'>Register </h1>
      {/* <img src={logo} alt="" /> */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='name' onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='tel' placeholder='phone number' className='border p-3 rounded-lg' id='mobile' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        {/* <button disabled={loading}  className='bg-black text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85'>{loading ? 'Loading...' : 'Sign Up'}</button> */}
        <button className='bg-black text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85'>Register</button>
      </form>
      <div className='flex justify-between gap-2 mt-5'>
        <div className='font-semibold '>
          <span>Have an account?</span>
          <Link to={'/'}><span className='text-blue-700'> Login</span></Link>
        </div>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp