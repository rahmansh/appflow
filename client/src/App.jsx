import { Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import EditJob from './pages/EditJob'

function App() {


  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddJob />} />
      <Route path="/edit/:id" element={<EditJob />} />
    </Routes>
  )
}

export default App
