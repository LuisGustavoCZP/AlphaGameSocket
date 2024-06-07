import { Route, Routes, Navigate } from 'react-router-dom';
import {Login} from '../pages/login'
import { MainRoom } from '../components/main-room'
import { Register } from '../pages/register';
import { HomePage } from '../pages/homepage';
import { PlayerContextProvider } from "../contexts"

export const Router = () => (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/"
        element={<PlayerContextProvider page={0}><HomePage /></PlayerContextProvider>}
      />
    </Routes>
  );