
import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import '../styles/AddReelPage.css';
import { useNavigate } from 'react-router-dom';

const AddReelPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user: '',
    skillId: '',
    subSkillsId: '',
  });
  const [reelVideo, setReelVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [subSkills, setSubSkills] = useState([]);
  const [filteredSubSkills, setFilteredSubSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users
    apiClient.get('/admin/users?limit=1000')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(err => console.error("Failed to fetch users:", err));

    // Fetch skills and sub-skills
    apiClient.get('/skills-and-subskills')
        .then(response => {
            setSkills(response.data.data.skills);
            setSubSkills(response.data.data.subSkills);
        })
        .catch(err => console.error("Failed to fetch skills and sub-skills:", err));
  }, []);

  const handleSkillChange = (e) => {
    const selectedSkillId = e.target.value;
    setFormData((prev) => ({ ...prev, skillId: selectedSkillId, subSkillsId: '' }));
    const relatedSubSkills = subSkills.filter(sub => sub.skillId === selectedSkillId);
    setFilteredSubSkills(relatedSubSkills);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'reelvideo') {
      setReelVideo(files[0]);
    } else if (name === 'thumbnail') {
      setThumbnail(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('user', formData.user);
    data.append('skillId', formData.skillId);
    data.append('subSkillsId', formData.subSkillsId);
    if (reelVideo) {
        data.append('reelvideo', reelVideo);
    }
    if (thumbnail) {
        data.append('thumbnail', thumbnail);
    }

    try {
      await apiClient.post('/admin/upload/reel', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/reels');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload reel.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-reel-page">
      <h1>Add New Reel</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-reel-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user">User</label>
          <select id="user" name="user" value={formData.user} onChange={handleChange} required>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.fullName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="skillId">Skill</label>
          <select id="skillId" name="skillId" value={formData.skillId} onChange={handleSkillChange} required>
            <option value="">Select a skill</option>
            {skills.map(skill => (
              <option key={skill._id} value={skill._id}>{skill.skillName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subSkillsId">Sub-Skill</label>
           <select id="subSkillsId" name="subSkillsId" value={formData.subSkillsId} onChange={handleChange} required disabled={!formData.skillId}>
            <option value="">Select a sub-skill</option>
            {filteredSubSkills.map(subSkill => (
              <option key={subSkill._id} value={subSkill._id}>{subSkill.subSkillName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reelvideo">Reel Video</label>
          <input
            type="file"
            id="reelvideo"
            name="reelvideo"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Reel'}
        </button>
      </form>
    </div>
  );
};

export default AddReelPage;
