<?php
require_once 'config.php';

function sendEmail($to, $subject, $message) {
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: District 11 Job Portal <noreply@yourdomain.com>' . "\r\n";
    
    // Send email
    return mail($to, $subject, $message, $headers);
}

function notifyNewPosition($positionId) {
    $conn = getDBConnection();
    
    // Get position details
    $sql = "SELECT 
        jo.*,
        f.name as facility_name,
        pt.title as position_title
        FROM job_openings jo
        JOIN facilities f ON jo.facility_id = f.id
        JOIN position_titles pt ON jo.position_id = pt.id
        WHERE jo.id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $positionId);
    $stmt->execute();
    $result = $stmt->get_result();
    $position = $result->fetch_assoc();
    
    if (!$position) {
        return false;
    }
    
    // Admin email address - update this
    $adminEmail = 'admin@yourdomain.com';
    
    // Create email content
    $subject = "New Position Opened: {$position['position_title']}";
    
    $message = "
    <html>
    <body>
        <h2>New Position Opening</h2>
        <p>A new position has been created with the following details:</p>
        <ul>
            <li><strong>Position:</strong> {$position['position_title']}</li>
            <li><strong>Facility:</strong> {$position['facility_name']}</li>
            <li><strong>Type:</strong> {$position['employment_type']}</li>
            <li><strong>Pay Rate:</strong> \${$position['pay_rate']}/hour</li>
            <li><strong>Shift:</strong> {$position['shift']}</li>
            <li><strong>Hours:</strong> {$position['start_time']} - {$position['end_time']}</li>
        </ul>
        <p><a href='https://yourdomain.com/dashboard/positions/{$position['id']}'>View Position Details</a></p>
    </body>
    </html>
    ";
    
    // Send notification
    $result = sendEmail($adminEmail, $subject, $message);
    
    $conn->close();
    return $result;
}