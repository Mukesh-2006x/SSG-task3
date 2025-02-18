import React, { useEffect, useState } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const API_URL = "http://localhost:3000/marks";

function Mark() {
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState({ id: '', name: '', phy: '', math: '', chem: '' });

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, phy, math, chem } = studentData;
    const newStudent = { name, phy: Number(phy), math: Number(math), chem: Number(chem) };

    try {
      if (id) {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });
      }
      setStudentData({ id: '', name: '', phy: '', math: '', chem: '' });
      fetchMarks();
    } catch (error) {
      console.error("Error adding/updating mark:", error);
    }
  };

  const handleEdit = (student) => setStudentData(student);

  const handleDelete = async (id) => {
     {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchMarks();
      } catch (error) {
        console.error("Error deleting mark:", error);
      }
    }
  };

  return (
    <div style={{ padding: '70px',paddingLeft:'20%', paddingRight:'20%',marginTop:'40px' }}>
      <Typography variant="h5" align="center" gutterBottom sx={{fontFamily:'fantasy'}}>STUDENTS MARKS</Typography>

      <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
        <TextField id="name" label="Name" variant="outlined" fullWidth value={studentData.name} onChange={handleChange} required margin="dense" />
        <TextField id="phy" label="Physics" variant="outlined" fullWidth type="number" value={studentData.phy} onChange={handleChange} required margin="dense" />
        <TextField id="math" label="Math" variant="outlined" fullWidth type="number" value={studentData.math} onChange={handleChange} required margin="dense" />
        <TextField id="chem" label="Chemistry" variant="outlined" fullWidth type="number" value={studentData.chem} onChange={handleChange} required margin="dense" />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
          {studentData.id ? "Update" : "Add"} Student
        </Button>
      </form>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Physics</TableCell>
              <TableCell>Math</TableCell>
              <TableCell>Chemistry</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.phy}</TableCell>
                  <TableCell>{student.math}</TableCell>
                  <TableCell>{student.chem}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => handleEdit(student)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(student.id)} style={{ marginLeft: '5px' }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Mark;
