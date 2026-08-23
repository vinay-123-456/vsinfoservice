<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'Website Inquiry';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode([
            "status" => "error",
            "message" => "Please fill in all required fields."
        ]);
        exit;
    }

    $to = "info@vsinfoservice.in";
    $headers  = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $email_content = "
    <h2>New Contact Inquiry - VS INFOSERVICE</h2>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Subject:</strong> {$subject}</p>
    <p><strong>Message:</strong><br>{$message}</p>
    ";

    // Attempt mail dispatch
    @mail($to, "VS Info Service Inquiry: " . $subject, $email_content, $headers);

    echo json_encode([
        "status" => "success",
        "message" => "Thank you! Your message has been sent successfully."
    ]);
    exit;
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method."
    ]);
    exit;
}
?>
