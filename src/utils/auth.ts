import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // Check for a token in localStorage
  return !!token; // Return true if token exists, false otherwise
};

export const logout = () => {
  localStorage.removeItem('token'); // Remove the token
  window.location.href = '/login'; // Redirect to login page
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token); // Decode the token to get user information
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 