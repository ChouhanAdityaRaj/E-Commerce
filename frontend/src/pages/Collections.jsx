import React from 'react'
import { Collection, Slider } from "../components"
import image from "../assets/image.jpg"

function Collections() {
  return (
    <div className='w-full h-full'>
      <Slider/>
      <Collection/>
    </div>
  )
}

export default Collections