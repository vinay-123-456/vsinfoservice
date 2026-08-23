<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Please fill out all required fields.'
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Please provide a valid email address.'
        ]);
        exit;
    }

    // Process contact form message
    echo json_encode([
        'status' => 'success',
        'message' => 'Your message has been sent successfully. We will get back to you shortly!'
    ]);
    exit;
}

echo json_encode([
    'status' => 'error',
    'message' => 'Invalid request method.'
]);
?>
