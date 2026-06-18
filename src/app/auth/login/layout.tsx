import React from 'react'
import Wrapper from '../wrapper'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
      <Wrapper isSignedIn={true}>
        {children}
      </Wrapper>
    </div>
  )
}

export default layout
