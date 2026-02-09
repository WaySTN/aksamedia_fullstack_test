<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        apiPrefix: '',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Force ALL exceptions to return JSON (bypass View rendering for Vercel)
        $exceptions->render(function (\Throwable $e, Request $request) {
            // Always return JSON for API routes
            if ($request->is('api/*') || $request->expectsJson() || true) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                return response()->json([
                    'status' => 'error',
                    'message' => app()->environment('production') && $statusCode === 500
                        ? 'Internal Server Error'
                        : $e->getMessage(),
                    'error' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ], $statusCode >= 100 && $statusCode < 600 ? $statusCode : 500);
            }
        });

        // Handle unauthenticated API requests specifically
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                ], 401);
            }
        });
    })->create();
