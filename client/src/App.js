
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminHome } from './pages/AdminHome';
import { AnnotatorHome } from './pages/AnnotatorHome';
import { Home } from './pages/Home';
import { Error } from './pages/Error';
import { AdminLogin } from './pages/AdminLogin';
import { AdminRegister } from './pages/AdminRegister';
import { AdminContextProvider } from './AdminContext';

function App() {
  return (
    <BrowserRouter>
    <AdminContextProvider>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/annotatorhome' element={<AnnotatorHome/>}/>
        <Route path='/adminlogin' element={<AdminLogin/>}/>
        <Route path='/adminregister' element={<AdminRegister/>}/>
        <Route path='/adminhome' element={<AdminHome/>}/>
        <Route path='*' element={<Error/>}/>
        <Route path='/error' element={<Error/>}/>
      </Routes>
    </AdminContextProvider>
    </BrowserRouter>
  );
}

export default App;
