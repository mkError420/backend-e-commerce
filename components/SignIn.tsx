import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

const SignIn = () => {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className='flex items-center space-x-2'>
        <span className='text-sm font-semibold text-lightColor'>Hi, {user.name}</span>
        <button
          onClick={logout}
          className='text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect'
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <Link href="/login">
      <button className='text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect'>
        Login
      </button>
    </Link>
  )
}

export default SignIn

export default SignIn
