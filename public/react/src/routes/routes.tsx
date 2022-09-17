import { Route, Routes, Navigate } from 'react-router-dom';
import {Login} from '../pages/login'
import {MainRoom} from '../components/main-room'

export const Router = () => (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
            <Login />
        }
      />

    </Routes>
  );