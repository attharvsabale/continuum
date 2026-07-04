import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Session from './pages/Session'
import AdaptiveLearningPage from './pages/AdaptiveLearningPage'
import ForStudents from './pages/ForStudents'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app" element={<Session />} />
        <Route path="/adaptive-learning" element={<AdaptiveLearningPage />} />
        <Route path="/for-students" element={<ForStudents />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
