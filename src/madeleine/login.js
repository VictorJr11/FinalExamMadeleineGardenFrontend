import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from './services/UserService';
import { 
  LockOutlined, 
  UserOutlined, 
  MailOutlined, 
  EyeInvisibleOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import './css/Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [currentForm, setCurrentForm] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    resetToken: '',
    newPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await UserService.loginUser(loginData.username, loginData.password);
      setSuccessMessage('Login successful');
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await UserService.registerUser(registerData);
      setSuccessMessage('Registration successful. Please login.');
      setCurrentForm('login');
    } catch (error) {
      setErrorMessage(error.response?.data || 'Registration failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await UserService.forgotPassword(forgotPasswordData.email);
      setSuccessMessage('Reset code sent');
      setCurrentForm('resetPassword');
      setResetPasswordData(prev => ({ ...prev, email: forgotPasswordData.email }));
    } catch (error) {
      setErrorMessage(error.response?.data || 'Failed to send reset code');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await UserService.resetPassword(resetPasswordData);
      setSuccessMessage('Password reset successful');
      setCurrentForm('login');
    } catch (error) {
      setErrorMessage(error.response?.data || 'Password reset failed');
    }
  };

  const FormWrapper = ({ children, title }) => (
    <div className="form-container">
      <div className="logo-container">
        {/* Le logo est maintenant géré par le CSS */}
      </div>
      <div className="form-wrapper">
        <h2 className="form-title">{title}</h2>
        {children}
      </div>
    </div>
  );

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="input-group">
      <label className="input-label">{props.label}</label>
      <div className="input-field">
        <Icon className="input-icon" />
        <input {...props} className="input" />
        {props.type === 'password' && (
          <button 
            type="button" 
            onClick={props.onTogglePassword}
            className="password-toggle"
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </button>
        )}
      </div>
    </div>
  );

  const SubmitButton = ({ children }) => (
    <button type="submit" className="submit-button">
      {children}
    </button>
  );

  const LinkButton = ({ onClick, children }) => (
    <button type="button" onClick={onClick} className="link-button">
      {children}
    </button>
  );

  const renderLoginForm = () => (
    <FormWrapper title="Welcome At Madeleine Garden">
      <form onSubmit={handleLogin}>
        <InputField
          icon={UserOutlined}
          type="text"
          name="username"
          label="Username"
          value={loginData.username}
          onChange={handleInputChange(setLoginData)}
          placeholder="Enter your username"
          required
        />
        <InputField
          icon={LockOutlined}
          type={showPassword ? "text" : "password"}
          name="password"
          label="Password"
          value={loginData.password}
          onChange={handleInputChange(setLoginData)}
          placeholder="Enter your password"
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
        />
        <div className="button-container">
          <SubmitButton>Sign In</SubmitButton>
          <div className="links-container">
            <LinkButton onClick={() => setCurrentForm('forgotPassword')}>
              Forgot Password?
            </LinkButton>
            <LinkButton onClick={() => setCurrentForm('register')}>
              Create Account
            </LinkButton>
          </div>
        </div>
      </form>
    </FormWrapper>
  );

  const renderRegisterForm = () => (
    <FormWrapper title="Create Account">
      <form onSubmit={handleRegister}>
        <InputField
          icon={UserOutlined}
          type="text"
          name="username"
          label="Username"
          value={registerData.username}
          onChange={handleInputChange(setRegisterData)}
          placeholder="Choose a username"
          required
        />
        <InputField
          icon={MailOutlined}
          type="email"
          name="email"
          label="Email"
          value={registerData.email}
          onChange={handleInputChange(setRegisterData)}
          placeholder="Enter your email"
          required
        />
        <InputField
          icon={LockOutlined}
          type={showPassword ? "text" : "password"}
          name="password"
          label="Password"
          value={registerData.password}
          onChange={handleInputChange(setRegisterData)}
          placeholder="Create a password"
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
        />
        <div className="button-container">
          <SubmitButton>Register</SubmitButton>
          <LinkButton onClick={() => setCurrentForm('login')}>
            Already have an account? Sign In
          </LinkButton>
        </div>
      </form>
    </FormWrapper>
  );

  const renderForgotPasswordForm = () => (
    <FormWrapper title="Forgot Password">
      <form onSubmit={handleForgotPassword}>
        <InputField
          icon={MailOutlined}
          type="email"
          name="email"
          label="Email"
          value={forgotPasswordData.email}
          onChange={handleInputChange(setForgotPasswordData)}
          placeholder="Enter your email"
          required
        />
        <div className="button-container">
          <SubmitButton>Send Reset Code</SubmitButton>
          <LinkButton onClick={() => setCurrentForm('login')}>
            Remember your password? Sign In
          </LinkButton>
        </div>
      </form>
    </FormWrapper>
  );

  const renderResetPasswordForm = () => (
    <FormWrapper title="Reset Password">
      <form onSubmit={handleResetPassword}>
        <InputField
          icon={LockOutlined}
          type="text"
          name="resetToken"
          label="Reset Code"
          value={resetPasswordData.resetToken}
          onChange={handleInputChange(setResetPasswordData)}
          placeholder="Enter reset code"
          required
        />
        <InputField
          icon={LockOutlined}
          type={showPassword ? "text" : "password"}
          name="newPassword"
          label="New Password"
          value={resetPasswordData.newPassword}
          onChange={handleInputChange(setResetPasswordData)}
          placeholder="Enter new password"
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
        />
        <div className="button-container">
          <SubmitButton>Reset Password</SubmitButton>
          <LinkButton onClick={() => setCurrentForm('login')}>
            Back to Sign In
          </LinkButton>
        </div>
      </form>
    </FormWrapper>
  );

  return (
    <div className="page-container">
      <div className="content-container">
        {errorMessage && (
          <div className="alert error-alert">
            <p className="alert-title">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="alert success-alert">
            <p className="alert-title">Success</p>
            <p>{successMessage}</p>
          </div>
        )}

        {currentForm === 'login' && renderLoginForm()}
        {currentForm === 'register' && renderRegisterForm()}
        {currentForm === 'forgotPassword' && renderForgotPasswordForm()}
        {currentForm === 'resetPassword' && renderResetPasswordForm()}
      </div>
    </div>
  );
};

export default LoginPage;