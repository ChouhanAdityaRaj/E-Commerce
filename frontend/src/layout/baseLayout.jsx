import React from 'react'
import { Outlet } from "react-router-dom"

function baseLayout() {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default baseLayout