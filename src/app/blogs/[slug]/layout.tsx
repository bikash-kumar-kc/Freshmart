import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='w-full max-w-7xl mx-auto bg-amber-50'>
      {children}
    </div>
  )
}

export default layout
