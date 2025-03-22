import React, { useState } from 'react';
import {loginUser} from '../services/authService'

// Авторизация (логин)
// async function loginUser(userData) {
//   try {
//     const response = await axios.post(`${API_URL}/login`, {
//         username: userData.username ? username : null,
//         password: userData.password ? password : null
//     });
//     console.log('Response!');
//     return response.data;
//   } catch (error) {
//     const errorMessage = error.response ? error.response.data.detail : error.message;
//     throw new Error('Ошибка при входе: ' + errorMessage);
//   }
// };


const LoginPage = () => {
  // Состояние для хранения значений полей
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Обработчик изменения полей
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      const response = await loginUser({ username, password });
      console.log('Токены:', response);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginPage;