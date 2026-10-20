import { Route, Routes } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './routes/ProtectedRoute'

import Home from './pages/Home'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Users from './pages/Users'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Navbar />

      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/books"
            element={<div className="animate-fade-up"><Books /></div>}
          />
          <Route
            path="/books/:id"
            element={<div className="animate-fade-up"><BookDetails /></div>}
          />
          <Route path="/login" element={<div className="animate-fade-up"><Login /></div>} />
          <Route path="/register" element={<div className="animate-fade-up"><Register /></div>} />

          <Route
            path="/users"
            element={
              <ProtectedRoute roles={['admin', 'superAdmin']}>
                <div className="animate-fade-up"><Users /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </>
  )
}
