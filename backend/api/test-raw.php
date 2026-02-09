<?php

// This is a minimal entry point that bypasses Laravel entirely
// Use this to test if PHP is working on Vercel at all

header('Content-Type: application/json');
http_response_code(200);

echo json_encode([
    'status' => 'success',
    'message' => 'Raw PHP is working on Vercel!',
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'timestamp' => date('Y-m-d H:i:s'),
]);
