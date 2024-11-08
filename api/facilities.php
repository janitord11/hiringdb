<?php
require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT id, name FROM facilities ORDER BY name";
        $result = $conn->query($sql);
        $facilities = [];
        
        while ($row = $result->fetch_assoc()) {
            $facilities[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $facilities
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
        
        $stmt = $conn->prepare("INSERT INTO facilities (name) VALUES (?)");
        $stmt->bind_param("s", $data['name']);
        
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