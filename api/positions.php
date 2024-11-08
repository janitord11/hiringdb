<?php
require_once 'config.php';

$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT id, title FROM position_titles ORDER BY title";
        $result = $conn->query($sql);
        $positions = [];
        
        while ($row = $result->fetch_assoc()) {
            $positions[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $positions
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
        
        $stmt = $conn->prepare("INSERT INTO position_titles (title) VALUES (?)");
        $stmt->bind_param("s", $data['title']);
        
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