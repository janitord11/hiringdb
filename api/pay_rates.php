<?php
require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $positionId = $_GET['position_id'] ?? null;
        
        if (!$positionId) {
            echo json_encode([
                'success' => false,
                'error' => 'Position ID is required'
            ]);
            break;
        }
        
        $stmt = $conn->prepare(
            "SELECT id, rate 
             FROM pay_rates 
             WHERE position_id = ? 
             ORDER BY rate"
        );
        $stmt->bind_param("i", $positionId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $rates = [];
        while ($row = $result->fetch_assoc()) {
            $rates[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $rates
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
            "INSERT INTO pay_rates (position_id, rate) VALUES (?, ?)"
        );
        $stmt->bind_param("id", $data['positionId'], $data['rate']);
        
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