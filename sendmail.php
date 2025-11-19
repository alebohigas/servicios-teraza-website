<?php
header('Content-Type: application/json; charset=utf-8');

// basic POST check
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "invalid_method"]);
    exit;
}

// honeypot: if filled, treat as spam and pretend all good
$honeypot = isset($_POST['empresa']) ? trim($_POST['empresa']) : '';
if ($honeypot !== '') {
    echo json_encode(["success" => true]);
    exit;
}

// sanitize inputs
$nombre  = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$motivo  = isset($_POST['motivo']) ? trim($_POST['motivo']) : '';
$mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

if ($nombre === '' || $email === '' || $mensaje === '') {
    echo json_encode(["success" => false, "error" => "missing_fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "invalid_email"]);
    exit;
}

// main email to you
$to       = "info@serviciosteraza.com";
$subject  = "Nuevo mensaje desde el sitio web";
$body     =
    "Nombre: {$nombre}\n" .
    "Email: {$email}\n" .
    "Motivo: {$motivo}\n" .
    "Mensaje:\n{$mensaje}\n";

$headers  = "From: {$email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sentToYou = mail($to, $subject, $body, $headers);

// optional: confirmation email to user
if ($sentToYou) {
    $userSubject = "Hemos recibido tu mensaje - Servicios Teraza";
    $userBody =
"Hola {$nombre},

Gracias por escribirnos. Hemos recibido tu mensaje y en breve alguien de nuestro equipo se pondrá en contacto contigo.

Resumen de tu mensaje:
Motivo: {$motivo}
Mensaje:
{$mensaje}

Saludos,
Servicios Teraza";

    $userHeaders  = "From: info@serviciosteraza.com\r\n";
    $userHeaders .= "Reply-To: info@serviciosteraza.com\r\n";
    $userHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

    @mail($email, $userSubject, $userBody, $userHeaders);
}

echo json_encode(["success" => $sentToYou]);
exit;
