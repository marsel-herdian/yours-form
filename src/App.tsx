import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setUser } from './app/slices/authSlice';
import Loading from './components/Loading';
import AppLayout from './components/AppLayout';
import CreateForm from './pages/CreateForm';
import DetailForm from './pages/DetailForm';
import SubmitForm from './pages/SubmitForm';
import Forbidden from './pages/Forbidden';
import NoPage from './pages/NoPage';

export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    // Loading delay
    const delay = new Promise((res) => setTimeout(res, 500));

    Promise.all([delay]).then(() => {
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/submit/:slug" element={<SubmitForm />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/form/create" element={<CreateForm />} />
            <Route path="/form/:slug" element={<DetailForm />} />
          </Route>
        </Route>

        {/* Error Fallback */}
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
