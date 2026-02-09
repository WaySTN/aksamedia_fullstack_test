<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Simple test endpoint (no auth, no DB)
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend API is working!',
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
    ]);
});

// Public route - Login (only accessible when NOT authenticated)
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('guest');

// Protected routes - Require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Divisions
    Route::get('/divisions', [DivisionController::class, 'index']);

    // Employees CRUD
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
});
