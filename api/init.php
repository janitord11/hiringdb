<?php
require_once 'config.php';

$conn = getDBConnection();

// First, check if system_state table exists
$tableCheckSql = "SHOW TABLES LIKE 'system_state'";
$tableExists = $conn->query($tableCheckSql)->num_rows > 0;

$isInitialized = false;

if ($tableExists) {
    // Only check initialization status if the table exists
    $stmt = $conn->prepare("SELECT value FROM system_state WHERE key_name = 'system_initialized'");
    $stmt->execute();
    $result = $stmt->get_result();
    $isInitialized = $result->num_rows > 0;
}

if ($isInitialized) {
    // System is already initialized, just return success
    echo json_encode([
        'success' => true,
        'message' => 'System already initialized'
    ]);
    $conn->close();
    exit;
}

// If not initialized, proceed with initialization
$tables = [
    "CREATE TABLE IF NOT EXISTS system_state (
        id INT PRIMARY KEY AUTO_INCREMENT,
        key_name VARCHAR(50) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS facilities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE
    )",
    
    "CREATE TABLE IF NOT EXISTS position_titles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL UNIQUE
    )",
    
    "CREATE TABLE IF NOT EXISTS pay_rates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        position_id INT NOT NULL,
        rate DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (position_id) REFERENCES position_titles(id) ON DELETE CASCADE
    )",
    
    "CREATE TABLE IF NOT EXISTS job_openings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        facility_id INT NOT NULL,
        position_id INT NOT NULL,
        employment_type VARCHAR(50) NOT NULL,
        pay_rate DECIMAL(10,2) NOT NULL,
        shift VARCHAR(50) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Open',
        candidate_name VARCHAR(255),
        notes TEXT,
        date_opened TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status_updated_at TIMESTAMP NULL,
        FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
        FOREIGN KEY (position_id) REFERENCES position_titles(id) ON DELETE CASCADE
    )",
    
    "CREATE TABLE IF NOT EXISTS interviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        job_opening_id INT NOT NULL,
        interview_date DATETIME NOT NULL,
        candidate_name VARCHAR(255) NOT NULL,
        notes TEXT,
        FOREIGN KEY (job_opening_id) REFERENCES job_openings(id) ON DELETE CASCADE
    )"
];

$success = true;
$errors = [];

// Create tables
foreach ($tables as $sql) {
    if (!$conn->query($sql)) {
        $success = false;
        $errors[] = $conn->error;
    }
}

// If tables were created successfully, mark as initialized
if ($success) {
    $stmt = $conn->prepare("INSERT INTO system_state (key_name, value) VALUES ('system_initialized', 'true')");
    if (!$stmt->execute()) {
        $success = false;
        $errors[] = $stmt->error;
    }
}

$conn->close();

echo json_encode([
    'success' => $success,
    'errors' => $errors,
    'message' => $success ? 'System initialized successfully' : 'Initialization failed'
]);