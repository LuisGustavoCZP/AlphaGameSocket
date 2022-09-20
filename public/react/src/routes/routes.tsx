import { Route, Routes, Navigate } from 'react-router-dom';
import {Login} from '../pages/login'
import {MainRoom} from '../components/main-room'
import { Register } from '../pages/register';
import { HomePage } from '../pages/homepage';



export const Router = () => (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/home"
        element={<HomePage />}
      />
        <Route
        path="/room"
        element={<MainRoom />}
      />
    </Routes>
  );