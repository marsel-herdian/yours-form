import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { setUser } from '../app/slices/authSlice';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { RootState } from '../app/store';


// Yup schema
const schema = yup.object({
    email: yup.string().email('Email is invalid').required('Email Required'),
    password: yup.string().min(5, 'Minimal 5 karakter').required('Password Required'),
});

type LoginFormInputs = yup.InferType<typeof schema>;

export default function Login() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });

    // Login handler
    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, data);
            const userData = res.data.user;

            // Simpan ke Redux
            dispatch(setUser(userData));
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect ke home
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Login gagal');
        }
    };

    // Redirect jika user sudah login dan kembali ke Login Page
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
        console.log(user);
    }, [user]);

    // Set title
    useEffect(() => {
        document.title = `Login | Yours Forms`;
    }, []);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
            >
                <div className='flex flex-row items-center gap-2 w-fit mx-auto '>
                    <img src="/form-icon.svg" alt="dummy-logo" className='max-w-8 max-h-8 mx-auto'/>
                    <h1 className='text-4xl font-bold text-center text-indigo-600 text-nowrap'>Yours Form</h1>
                </div>
                <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

                <div className='flex flex-col gap-4'>
                    {/* Email */}
                    <TextField
                        label="Email"
                        fullWidth
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message || " "}
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        {...register('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={!!errors.password}
                        helperText={errors.password?.message || " "}>
                    </TextField>
                </div>

                {/* Login Button */}
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                    <LoginIcon className='inline mr-2' />
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </div>
    );
}
