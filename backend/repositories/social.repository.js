const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class SocialRepository {
  // CSR Activities
  async createCSRActivity(data) {
    const id = uuidv4();
    const { title, description, location, date, time, max_participants, status, created_by } = data;
    const query = `
      INSERT INTO csr_activities (id, title, description, location, date, time, max_participants, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      id, 
      title, 
      description || null, 
      location || null, 
      date, 
      time || null, 
      max_participants || null, 
      status || 'draft', 
      created_by || null
    ]);
    return { id, ...data };
  }

  async getAllCSRActivities() {
    const query = 'SELECT * FROM csr_activities ORDER BY created_at DESC';
    const [rows] = await pool.execute(query);
    return rows;
  }

  async getCSRActivityById(id) {
    const query = 'SELECT * FROM csr_activities WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  async updateCSRActivity(id, data) {
    const { title, description, location, date, time, max_participants, status } = data;
    const query = `
      UPDATE csr_activities 
      SET title = ?, description = ?, location = ?, date = ?, time = ?, max_participants = ?, status = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      title, 
      description || null, 
      location || null, 
      date, 
      time || null, 
      max_participants || null, 
      status || 'draft', 
      id
    ]);
    return { id, ...data };
  }

  async deleteCSRActivity(id) {
    const query = 'DELETE FROM csr_activities WHERE id = ?';
    await pool.execute(query, [id]);
    return { success: true };
  }

  // Employee Participation
  async createParticipation(data) {
    const id = uuidv4();
    const { csr_activity_id, employee_id, employee_name, department, gender } = data;
    const query = `
      INSERT INTO employee_participation (id, csr_activity_id, employee_id, employee_name, department, gender)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [
      id, 
      csr_activity_id || null, 
      employee_id, 
      employee_name, 
      department || null, 
      gender || null
    ]);
    return { id, ...data };
  }

  async getAllParticipations(filters = {}) {
    let query = 'SELECT * FROM employee_participation WHERE 1=1';
    const params = [];
    
    if (filters.department) {
      query += ' AND department = ?';
      params.push(filters.department);
    }
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.gender) {
      query += ' AND gender = ?';
      params.push(filters.gender);
    }
    
    query += ' ORDER BY joined_at DESC';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async getParticipationById(id) {
    const query = 'SELECT * FROM employee_participation WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  async updateParticipation(id, data) {
    const { employee_name, department, gender, status } = data;
    const query = `
      UPDATE employee_participation 
      SET employee_name = ?, department = ?, gender = ?, status = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      employee_name, 
      department || null, 
      gender || null, 
      status || 'registered', 
      id
    ]);
    return { id, ...data };
  }

  async deleteParticipation(id) {
    const query = 'DELETE FROM employee_participation WHERE id = ?';
    await pool.execute(query, [id]);
    return { success: true };
  }

  async approveParticipation(id) {
    const query = 'UPDATE employee_participation SET approved = TRUE WHERE id = ?';
    await pool.execute(query, [id]);
    return { success: true };
  }

  async rejectParticipation(id) {
    const query = 'UPDATE employee_participation SET approved = FALSE WHERE id = ?';
    await pool.execute(query, [id]);
    return { success: true };
  }

  async updateProof(id, proof_url) {
    const query = 'UPDATE employee_participation SET proof_url = ? WHERE id = ?';
    await pool.execute(query, [proof_url, id]);
    return { success: true };
  }

  // Diversity Dashboard
  async getGenderDistribution() {
    const query = `
      SELECT gender, COUNT(*) as count 
      FROM employee_participation 
      GROUP BY gender
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  async getDepartmentDistribution() {
    const query = `
      SELECT department, COUNT(*) as count 
      FROM employee_participation 
      GROUP BY department
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  async getParticipationTrends() {
    const query = `
      SELECT DATE(joined_at) as date, COUNT(*) as count 
      FROM employee_participation 
      GROUP BY DATE(joined_at) 
      ORDER BY date DESC 
      LIMIT 30
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }
}

module.exports = new SocialRepository();
