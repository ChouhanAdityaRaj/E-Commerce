import React from 'react'
import { Outlet } from "react-router-dom"
import { Header, Footer } from "../components"

function BaseLayout() {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default BaseLayout