import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Portal from './pages/Portal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/portal" element={<Portal />} />
      </Routes>
    </BrowserRouter>
  )
}