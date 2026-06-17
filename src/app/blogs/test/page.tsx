"use client"
import React from 'react'

const page = () => {
  return (
    <div>
      <button onClick={()=> console.log('say hello')}>{Math.random()}</button>
    </div>
  )
}

export default page
