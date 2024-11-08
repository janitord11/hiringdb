<?php
require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $jobOpeningId = $_GET['job_opening_id'] ?? null;
        
        if (!$jobOpeningId) {
            echo json_encode([
                'success' => false,
                'error' => 'Job Opening ID is required'
            ]);
            break;
        }
        
        $stmt = $conn->prepare(
            "SELECT * 
             FROM interviews 
             WHERE job_opening_id = ? 
             ORDER BY interview_date DESC"
        );
        $stmt->bind_param("i", $jobOpeningId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $interviews = [];
        while ($row = $result->fetch_assoc()) {
            $interviews[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $interviews
        ]);
        break;

    case 'POST':
        if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => 'Unauthorized'
            ]);
            break;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $conn->prepare(
            "INSERT INTO interviews (
                job_opening_id, 
                interview_date, 
                candidate_name, 
                notes
            ) VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param(
            "isss", 
            $data['jobOpeningId'],
            $data['interviewDate'],
            $data['candidateName'],
            $data['notes']
        );
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'id' => $conn->insert_id
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => $stmt->error
            ]);
        }
        break;
}

$conn->close();