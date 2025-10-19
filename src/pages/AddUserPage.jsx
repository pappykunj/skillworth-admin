import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert, Box } from '@mui/material';
import { addUser } from '../api/admin';
import '../styles/AddUserPage.css';

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '',
    phone: '',
    password: '',
    role: 'User',
    occupation: '',
    aboutUser: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const phone = `${formData.countryCode} ${formData.phone}`.trim();
      const response = await addUser({ ...formData, phone });
      setSnackbar({ open: true, message: response.message || 'User added successfully!', severity: 'success' });
      setTimeout(() => navigate('/dashboard/users'), 2000);
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to add user.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="add-user-page">
      <h1>Add New User</h1>
      <form onSubmit={handleSubmit} className="add-user-form">
        <TextField
          name="fullName"
          label="Full Name"
          variant="outlined"
          fullWidth
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Box className="phone-input-container">
          <TextField
            name="countryCode"
            label="Code"
            variant="outlined"
            className="country-code-field"
            value={formData.countryCode}
            onChange={handleChange}
          />
          <TextField
            name="phone"
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
          />
        </Box>
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          name="occupation"
          label="Occupation"
          variant="outlined"
          fullWidth
          value={formData.occupation}
          onChange={handleChange}
        />
        <TextField
          name="aboutUser"
          label="About User"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={formData.aboutUser}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add User
        </Button>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddUserPage;
