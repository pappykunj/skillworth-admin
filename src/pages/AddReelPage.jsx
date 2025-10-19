import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Chip, Snackbar, Alert } from '@mui/material';
import apiClient from '../api';
import '../styles/AddReelPage.css';

const AddReelPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [skills, setSkills] = useState([]);
  const [subSkills, setSubSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSubSkills, setSelectedSubSkills] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const fetchSkills = useCallback(async () => {
    try {
      const response = await apiClient.get('/admin/get/skills');
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  }, []);

  const fetchSubSkills = useCallback(async () => {
    try {
      const response = await apiClient.get('/admin/get/subskills');
      setSubSkills(response.data.subSkills || []);
    } catch (error) {
      console.error("Failed to fetch sub-skills:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await apiClient.get('/admin/get/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
    fetchSubSkills();
    fetchUsers();
  }, [fetchSkills, fetchSubSkills, fetchUsers]);

  const handleVideoFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleThumbnailFileChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('user', selectedUser);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('reelvideo', video);
    formData.append('skillId', selectedSkills[0]);
    formData.append('subSkillsId', selectedSubSkills[0]);
    formData.append('thumbnail', thumbnail);

    try {
      await apiClient.post('http://skillsworth-be-11s8.onrender.com/admin/upload/reel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbar({ open: true, message: 'Reel added successfully!', severity: 'success' });
      setTimeout(() => navigate('/dashboard/reels'), 2000);
    } catch (error) {
      console.error("Failed to add reel:", error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to add reel.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="add-reel-page">
      <h1>Add New Reel</h1>
      <form onSubmit={handleSubmit} className="add-reel-form">
        <FormControl fullWidth>
          <InputLabel>User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Skills</InputLabel>
          <Select
            value={selectedSkills}
            onChange={(e) => setSelectedSkills([e.target.value])}
            renderValue={(selected) => {
                const skill = skills.find(s => s._id === selected[0]);
                return <Chip key={selected[0]} label={skill ? skill.skillName : ''} />;
            }}
          >
            {skills.map((skill) => (
              <MenuItem key={skill._id} value={skill._id}>
                {skill.skillName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Sub-Skills</InputLabel>
          <Select
            value={selectedSubSkills}
            onChange={(e) => setSelectedSubSkills([e.target.value])}
            renderValue={(selected) => {
                const subSkill = subSkills.find(s => s._id === selected[0]);
                return <Chip key={selected[0]} label={subSkill ? subSkill.subSkillName : ''} />;
            }}
          >
            {subSkills.map((subSkill) => (
              <MenuItem key={subSkill._id} value={subSkill._id}>
                {subSkill.subSkillName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          fullWidth
        >
          Upload Video
          <input
            type="file"
            hidden
            onChange={handleVideoFileChange}
            accept="video/*"
            required
          />
        </Button>
        {video && <p>Selected video: {video.name}</p>}
        <Button
          variant="contained"
          component="label"
          fullWidth
        >
          Upload Thumbnail
          <input
            type="file"
            hidden
            onChange={handleThumbnailFileChange}
            accept="image/*"
            required
          />
        </Button>
        {thumbnail && <p>Selected thumbnail: {thumbnail.name}</p>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Reel
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

export default AddReelPage;
