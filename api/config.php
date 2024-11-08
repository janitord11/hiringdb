<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'qeloaute_peoria');
define('DB_PASS', 'testing1234!!@');
define('DB_NAME', 'qeloaute_d14');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for API responses
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Connect to database
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die(json_encode([
            'success' => false,
            'error' => 'Connection failed: ' . $conn->connect_error
        ]));
    }
    
    return $conn;
}