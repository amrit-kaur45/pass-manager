import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white'>
      <div className='flex justify-between items-center px-6 py-2 h-15 mycontainer'>

        {/* logo */}
        <div className="font-bold text-lg">
          <span className='text-green-400'>&lt;</span>
          Pass-Manager
          <span className='text-green-400'>/&gt;</span>
        </div>

      </div>
    </nav>
  )
}

export default Navbar