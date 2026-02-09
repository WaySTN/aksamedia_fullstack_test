<?php

// More defensive entry point with explicit error handling
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

try {
    // Check if Laravel public index exists
    $publicIndex = __DIR__ . '/../public/index.php';

    if (!file_exists($publicIndex)) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Laravel entry point not found',
            'file' => $publicIndex,
        ]);
        exit(1);
    }

    // Load Laravel
    require $publicIndex;

} catch (\Throwable $e) {
    // Catch ANY error during bootstrap
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Bootstrap failed: ' . $e->getMessage(),
        'error' => get_class($e),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => array_slice($e->getTrace(), 0, 5), // First 5 frames only
    ]);
    exit(1);
}
