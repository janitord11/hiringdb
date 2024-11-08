<?php
require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode([
            'success' => false,
            'error' => 'Position ID is required'
        ]);
        exit;
    }
    
    $sql = "SELECT 
                jo.*,
                f.name as facility_name,
                pt.title as position_title
            FROM job_openings jo
            JOIN facilities f ON jo.facility_id = f.id
            JOIN position_titles pt ON jo.position_id = pt.id
            WHERE jo.id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $position = $result->fetch_assoc();
    
    if ($position) {
        echo json_encode([
            'success' => true,
            'data' => $position
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Position not found'
        ]);
    }
}

$conn->close();