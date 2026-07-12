import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-slate-800 text-white'>
      <div className='flex flex-col justify-center items-center gap-1 py-4 mycontainer'>

        {/* logo */}
        <div className="font-bold text-lg">
          <span className='text-green-400'>&lt;</span>
          Pass-Manager
          <span className='text-green-400'>/&gt;</span>
        </div>

        <p className='text-slate-400 text-xs'>© 2026 Pass-Manager. All rights reserved.</p>

      </div>
    </footer>
  )
}

export default Footer