import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { setUser } from '../app/slices/authSlice';

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(setUser(null));
    navigate('/login');
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className='flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-all duration-500 ease-in-out' onClick={() => navigate('/')}>
        <img src="/form-icon.svg" alt="dummy-logo" className='max-w-8 max-h-8' />
        <h1 className="text-3xl font-bold  cursor-pointer text-nowrap">Yours Form</h1>
      </div>

      {/* Profile section */}
      <div
        className="relative "
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <div className="flex items-center gap-3 ">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-800 font-medium">{user?.name || 'User'}</span>
        </div>

        {/* Dropdown/Logout Button */}
        <div
          className={`absolute right-0 mt-4 -mr-4 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${showDropdown ? 'max-h-40 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
            }`}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-700 hover:bg-gray-100 cursor-pointer"
          >
            <Logout fontSize="small" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
