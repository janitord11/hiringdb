<?php
require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT 
                jo.*,
                f.name as facility_name,
                pt.title as position_title,
                CASE 
                    WHEN jo.status = 'Filled' THEN jo.status_updated_at
                    ELSE NULL
                END as filled_date
            FROM job_openings jo
            JOIN facilities f ON jo.facility_id = f.id
            JOIN position_titles pt ON jo.position_id = pt.id
            WHERE jo.status = 'Filled'
            ORDER BY jo.status_updated_at DESC";
    
    $result = $conn->query($sql);
    $positions = [];
    
    while ($row = $result->fetch_assoc()) {
        $positions[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $positions
    ]);
}

$conn->close();