<?php
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = ltrim($path, '/api/');

switch ($path) {
    case '':
    case 'init':
        require __DIR__ . '/init.php';
        break;
    
    case 'job_openings':
        require __DIR__ . '/job_openings.php';
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
}