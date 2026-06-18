import React from 'react'
import Wrapper from '../wrapper'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <Wrapper isSignedIn={false}>
      {children}
    </Wrapper>
  )
}

export default layout
