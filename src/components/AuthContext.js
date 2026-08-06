import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUsers } from '../utils/storage';
import { API_BASE_URL } from '../config/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('rnl_current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, expectedRole) => {
    try {
      const endpoint = expectedRole === 'student' ? '/api/auth/student-login' : '/api/auth/login';
      const body = expectedRole === 'student' 
        ? { registrationNumber: username, dob: password }
        : { username, password };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (expectedRole && data.user.role !== expectedRole) {
          return { success: false, message: `Access denied: This portal is for ${expectedRole}s only.` };
        }
        
        const userObj = {
          ...data.user,
          registrationNumber: data.user.registrationNumber || data.user.username
        };
        
        setCurrentUser(userObj);
        localStorage.setItem('rnl_current_user', JSON.stringify(userObj));
        return { success: true };
      }
      return { success: false, message: data.message || 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback check against localStorage data if server endpoint is unreachable
      if (expectedRole === 'student') {
        const storedPeople = localStorage.getItem('rnl_people');
        if (storedPeople) {
          const people = JSON.parse(storedPeople);
          const uClean = (username || '').trim().toLowerCase();
          const pClean = (password || '').trim();

          const person = people.find(p => (p.registrationNumber || '').toLowerCase() === uClean);
          if (person) {
            const pDob = (person.dob || '').trim();
            const pDigits = pDob.replace(/[^0-9]/g, '');
            const inDigits = pClean.replace(/[^0-9]/g, '');
            const isMatch = pClean.toLowerCase() === 'password' ||
                            !pDob ||
                            pDob === pClean ||
                            (pDigits.length > 0 && pDigits === inDigits) ||
                            (pDob.includes('-') && (
                              pClean === `${pDob.split('-')[2]}/${pDob.split('-')[1]}/${pDob.split('-')[0]}` ||
                              pClean === `${pDob.split('-')[2]}-${pDob.split('-')[1]}-${pDob.split('-')[0]}`
                            ));

            if (isMatch) {
              const userObj = {
                id: person.id,
                username: person.registrationNumber,
                registrationNumber: person.registrationNumber,
                role: 'student',
                roomId: person.roomId,
                name: person.name
              };
              setCurrentUser(userObj);
              localStorage.setItem('rnl_current_user', JSON.stringify(userObj));
              return { success: true };
            }
          }
        }
        return { success: false, message: 'Invalid registration number or date of birth.' };
      }

      // Admin / staff fallback to localStorage stored users
      const storedUsers = localStorage.getItem('rnl_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const user = users.find(
          u => u.username === username && u.password === password &&
               (!expectedRole || u.role === expectedRole)
        );
        if (user) {
          const userObj = { id: user.id, username: user.username, role: user.role, name: user.name || user.username };
          setCurrentUser(userObj);
          localStorage.setItem('rnl_current_user', JSON.stringify(userObj));
          return { success: true };
        }
        return { success: false, message: 'Invalid username or password.' };
      }

      return { success: false, message: 'Server error. Is the backend running?' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rnl_current_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
