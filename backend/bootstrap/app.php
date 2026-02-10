<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
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
        // Return JSON for unauthenticated requests (must be registered before Throwable)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
            ], 401);
        });

        // Force all other exceptions to return JSON (bypass View rendering for Vercel)
        $exceptions->render(function (\Throwable $e, Request $request) {
            $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            $validStatus = $statusCode >= 100 && $statusCode < 600 ? $statusCode : 500;

            $response = [
                'status' => 'error',
                'message' => app()->environment('production') && $validStatus === 500
                    ? 'Internal Server Error'
                    : $e->getMessage(),
            ];

            // Only expose debug details in non-production environments
            if (!app()->environment('production')) {
                $response['exception'] = get_class($e);
                $response['file'] = $e->getFile();
                $response['line'] = $e->getLine();
            }

            return response()->json($response, $validStatus);
        });
    })->create();
