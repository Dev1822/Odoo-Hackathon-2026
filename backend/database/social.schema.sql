-- CSR Activities Table
CREATE TABLE IF NOT EXISTS csr_activities (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date DATE NOT NULL,
  time TIME,
  max_participants INT,
  status ENUM('draft', 'open', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employee Participation Table
CREATE TABLE IF NOT EXISTS employee_participation (
  id VARCHAR(36) PRIMARY KEY,
  csr_activity_id VARCHAR(36),
  employee_id VARCHAR(255) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  gender ENUM('male', 'female', 'other'),
  status ENUM('registered', 'attended', 'completed', 'cancelled') DEFAULT 'registered',
  proof_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (csr_activity_id) REFERENCES csr_activities(id) ON DELETE CASCADE
);
