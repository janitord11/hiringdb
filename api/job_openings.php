<?php
require_once 'config.php';
require_once 'notifications.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT 
                    jo.*,
                    f.name as facility_name,
                    pt.title as position_title
                FROM job_openings jo
                JOIN facilities f ON jo.facility_id = f.id
                JOIN position_titles pt ON jo.position_id = pt.id
                WHERE jo.status = 'Open'
                ORDER BY jo.date_opened DESC";
        
        $result = $conn->query($sql);
        $openings = [];
        
        while ($row = $result->fetch_assoc()) {
            $openings[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $openings
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO job_openings (
                    facility_id,
                    position_id,
                    employment_type,
                    pay_rate,
                    shift,
                    start_time,
                    end_time,
                    description,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open')";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "iisdssss",
            $data['facilityId'],
            $data['positionId'],
            $data['employmentType'],
            $data['payRate'],
            $data['shift'],
            $data['startTime'],
            $data['endTime'],
            $data['description']
        );
        
        if ($stmt->execute()) {
            $newId = $conn->insert_id;
            
            // Send notification email
            notifyNewPosition($newId);
            
            echo json_encode([
                'success' => true,
                'id' => $newId
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => $stmt->error
            ]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            echo json_encode([
                'success' => false,
                'error' => 'No ID provided'
            ]);
            break;
        }
        
        $updates = [];
        $params = [];
        $types = "";
        
        if (isset($data['status'])) {
            $updates[] = "status = ?";
            $params[] = $data['status'];
            $types .= "s";
        }
        
        if (isset($data['candidateName'])) {
            $updates[] = "candidate_name = ?";
            $params[] = $data['candidateName'];
            $types .= "s";
        }
        
        if (isset($data['notes'])) {
            $updates[] = "notes = ?";
            $params[] = $data['notes'];
            $types .= "s";
        }
        
        if (count($updates) > 0) {
            $sql = "UPDATE job_openings SET " . implode(", ", $updates) . 
                   ", status_updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            
            $stmt = $conn->prepare($sql);
            $types .= "i";
            $params[] = $id;
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => $stmt->error
                ]);
            }
        }
        break;
}

$conn->close();