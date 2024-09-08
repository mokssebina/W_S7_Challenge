import React from 'react'
import Home from './Home'
import Form from './Form'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'


function App() {

  const location = useLocation()

  return (
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <Link className={location.pathname === '/'? 'active': ''} to={'/'}>Home</Link>
        <Link className={location.pathname === '/order'? 'active': ''} to={'/order'}>Order</Link>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/order' element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
