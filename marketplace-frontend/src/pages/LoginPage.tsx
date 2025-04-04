import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { usersApi } from '../services/api';
import { loginStart, loginSuccess, loginFailure } from '../features/authSlice'; 
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { AppDispatch } from '../app/store'; // Import AppDispatch type

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // We can get loading state from Redux now
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type

  // Get loading and error state from Redux (optional, depends on UX)
  // const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart()); // Dispatch loginStart
    try {
      const loginResponse = await usersApi.login({ username, password });
      localStorage.setItem('token', loginResponse.token);
      
      // Fetch user profile after successful login
      try {
        const userProfile = await usersApi.getProfile();
        // Dispatch login success with token and user data
        dispatch(loginSuccess({ token: loginResponse.token, user: userProfile.data }));
        navigate('/'); // Redirect to home page
      } catch (profileError) {
          console.error('Failed to fetch profile:', profileError);
          // Handle profile fetch error - maybe log user in but show profile error?
          // For now, dispatch login success but without user data
          dispatch(loginSuccess({ token: loginResponse.token }));
          navigate('/'); // Redirect anyway
      }

    } catch (err) {
      const errorMessage = 'Invalid username or password';
      dispatch(loginFailure(errorMessage)); // Dispatch loginFailure
      console.error('Login failed:', err);
    }
  };
  
  // You might want to get the error state from Redux to display it
  // const authError = useSelector((state: RootState) => state.auth.error);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="Username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-1"
              />
            </div>
          </div>

          {/* Display error from Redux state if desired */}
          {/* {authError && ( */}
          {/*   <p className="text-center text-sm text-red-600">{authError}</p> */}
          {/* )} */}

          <div>
            {/* Get loading state from Redux state if desired */}
            {/* <Button type="submit" className="w-full" isLoading={loading} disabled={loading}> */}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 