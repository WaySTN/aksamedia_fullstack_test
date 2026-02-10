<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes are served without the '/api' prefix since
| apiPrefix is set to '' in bootstrap/app.php.
|
*/

// Health check endpoint (no auth required)
Route::get('/test', fn() => response()->json([
    'status' => 'success',
    'message' => 'Backend API is working!',
    'php_version' => PHP_VERSION,
    'laravel_version' => app()->version(),
]))->name('api.test');

// Public route — Login (only accessible when NOT authenticated)
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('guest')
    ->name('api.login');

// Protected routes — Require Sanctum authentication
Route::middleware('auth:sanctum')->group(function () {

    // Auth management
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('api.profile.update');

    // Divisions (read-only)
    Route::get('/divisions', [DivisionController::class, 'index'])->name('api.divisions.index');

    // Employees CRUD
    Route::get('/employees', [EmployeeController::class, 'index'])->name('api.employees.index');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('api.employees.store');
    Route::put('/employees/{id}', [EmployeeController::class, 'update'])->name('api.employees.update');
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy'])->name('api.employees.destroy');
});
