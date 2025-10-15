import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import apiClient from '../api';
import '../styles/SubSkillsPage.css';

const SubSkillsPage = () => {
  const [allSkills, setAllSkills] = useState([]); // For dropdown
  const [subSkills, setSubSkills] = useState([]);
  const [loadingSubSkills, setLoadingSubSkills] = useState(false);

  const [subSkillsPaginationModel, setSubSkillsPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [subSkillsRowCount, setSubSkillsRowCount] = useState(0);

  const [subSkillModalOpen, setSubSkillModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, type: null, id: null });
  const [editedSubSkill, setEditedSubSkill] = useState(null);

  const fetchAllSkillsForDropdown = async () => {
    try {
      const response = await apiClient.get('/admin/get/skills?limit=1000'); 
      setAllSkills(response.data.skills || []);
    } catch (error) {
      console.error("Failed to fetch all skills for dropdown:", error);
    }
  };

  const fetchSubSkills = useCallback(async () => {
    setLoadingSubSkills(true);
    try {
      const response = await apiClient.get(`/admin/get/subSkills?page=${subSkillsPaginationModel.page + 1}&limit=${subSkillsPaginationModel.pageSize}`);
      setSubSkills((response.data.subSkills || []).map(ss => ({ ...ss, id: ss._id })));
      setSubSkillsRowCount(response.data.totalSubSkills || 0);
    } catch (error) {
      console.error("Failed to fetch sub-skills:", error);
      setSubSkills([]);
    }
    setLoadingSubSkills(false);
  }, [subSkillsPaginationModel]);

  useEffect(() => { fetchSubSkills(); }, [fetchSubSkills]);
  useEffect(() => { fetchAllSkillsForDropdown(); }, []);

  const handleAddSubSkill = () => {
    setEditedSubSkill({ subSkillName: '', skillId: '', color: '#ffffff' });
    setSubSkillModalOpen(true);
  };
  const handleEditSubSkill = (subSkill) => {
    setEditedSubSkill({ ...subSkill, skillId: subSkill.skillId?._id || '' });
    setSubSkillModalOpen(true);
  };
  const handleDeleteSubSkill = (id) => { setDeleteConfirmation({ open: true, type: 'sub-skill', id }); };

  const handleSaveSubSkill = async () => {
    if (!editedSubSkill) return;
    const url = editedSubSkill.id ? `/subskill/update/${editedSubSkill.id}` : '/subskill/add';
    const method = editedSubSkill.id ? 'put' : 'post';
    const payload = { subSkillName: editedSubSkill.subSkillName, skillId: editedSubSkill.skillId, color: editedSubSkill.color };
    try {
      await apiClient[method](url, payload);
      fetchSubSkills();
      setSubSkillModalOpen(false);
      setEditedSubSkill(null);
    } catch (error) { console.error('Failed to save sub-skill', error); }
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmation;
    let url = `/subskill/delete/${id}`;

    try {
      await apiClient.delete(url);
      fetchSubSkills();
      setDeleteConfirmation({ open: false, type: null, id: null });
    } catch (error) { console.error(`Failed to delete ${type}`, error); }
  };

  const subSkillsColumns = [
    { field: 'subSkillName', headerName: 'Sub-Skill Name', flex: 1 },
    { field: 'skillId', headerName: 'Parent Skill', flex: 1, valueGetter: (params) => params.row?.skillId?.skillName || 'N/A' },
    { field: 'color', headerName: 'Color', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1, sortable: false,
      renderCell: ({ row }) => (
        <div>
          <IconButton onClick={() => handleEditSubSkill(row)}><FaEdit /></IconButton>
          <IconButton onClick={() => handleDeleteSubSkill(row.id)}><FaTrash /></IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="sub-skills-page">
        <div className="page-header">
            <h1>Sub-Skills Management</h1>
            <Button variant="contained" color="primary" size="small" startIcon={<FaPlus />} onClick={handleAddSubSkill}>
                Add Sub-Skill
            </Button>
        </div>

      <div className="sub-skills-container">
        <div className="skills-header">
            <h2>Sub-Skills</h2>
        </div>
        <div style={{ height: 600, width: '100%' }}><DataGrid rows={subSkills} columns={subSkillsColumns} loading={loadingSubSkills} rowCount={subSkillsRowCount} pageSizeOptions={[10, 20, 50]} paginationModel={subSkillsPaginationModel} onPaginationModelChange={setSubSkillsPaginationModel} paginationMode="server" /></div>
      </div>

      <Dialog open={subSkillModalOpen} onClose={() => setSubSkillModalOpen(false)}>
        <DialogTitle>{editedSubSkill?.id ? 'Edit Sub-Skill' : 'Add Sub-Skill'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Sub-Skill Name" type="text" fullWidth value={editedSubSkill?.subSkillName || ''} onChange={(e) => setEditedSubSkill({ ...editedSubSkill, subSkillName: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Parent Skill</InputLabel>
            <Select
              value={editedSubSkill?.skillId || ''}
              onChange={(e) => setEditedSubSkill({ ...editedSubSkill, skillId: e.target.value })}
            >
              {allSkills.map((skill) => (
                <MenuItem key={skill._id} value={skill._id}>
                  {skill.skillName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            <div className="color-picker-container">
                <TextField margin="dense" label="Color" type="text" fullWidth value={editedSubSkill?.color || ''} onChange={(e) => setEditedSubSkill({ ...editedSubSkill, color: e.target.value })} />
                <input type="color" value={editedSubSkill?.color || '#ffffff'} onChange={(e) => setEditedSubSkill({ ...editedSubSkill, color: e.target.value })} />
            </div>
        </DialogContent>
        <DialogActions><Button onClick={() => setSubSkillModalOpen(false)}>Cancel</Button><Button onClick={handleSaveSubSkill}>Save</Button></DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, type: null, id: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this {deleteConfirmation.type}?</DialogContent>
        <DialogActions><Button onClick={() => setDeleteConfirmation({ open: false, type: null, id: null })}>Cancel</Button><Button onClick={confirmDelete} color="error">Delete</Button></DialogActions>
      </Dialog>
    </div>
  );
};

export default SubSkillsPage;
