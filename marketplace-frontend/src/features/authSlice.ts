import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Function to load state from localStorage
const loadAuthState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    // You might want to store/load user data too, or fetch it based on the token
    // For simplicity, we'll just load the token for now
    if (token) {
      // TODO: Validate token and fetch user data if needed
      return {
        token,
        user: null, // Fetch user profile separately
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error("Could not load auth state from localStorage", e);
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user?: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null; // User might be fetched later
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
      localStorage.removeItem('token');
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // Optionally re-affirm authentication if user is successfully fetched
      if (action.payload && state.token) {
          state.isAuthenticated = true;
      }
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions;
export default authSlice.reducer; 