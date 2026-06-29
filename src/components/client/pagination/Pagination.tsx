import { useGetCategories } from '@/src/hooks/useGetCategories'
import React from 'react'

const Pagination = () => {
    const {data:categoriesInfo,isLoading:loadingCategories} = useGetCategories();
  return (
    <div>
      
    </div>
  )
}

export default Pagination
