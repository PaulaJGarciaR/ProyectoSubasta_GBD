import React from 'react'
import {useAuth} from '../context/AuthContext'

function DashboardPage() {
  const {logout} = useAuth()
  return (
    <div className='flex justify-around'>DashboardPage
      <div className=''>
        <button onClick={()=> logout()} className='cursor-pointer  px-4 py-2 bg-red-400'>Logout</button>
      </div>
      
    </div>
  )
}

export default DashboardPage