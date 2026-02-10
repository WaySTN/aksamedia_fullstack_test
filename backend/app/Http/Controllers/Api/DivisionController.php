<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles division-related operations.
 *
 * Provides read-only access to division data
 * with optional name-based filtering and pagination.
 */
class DivisionController extends Controller
{
    /**
     * Display a paginated listing of divisions.
     *
     * Supports optional filtering by name using a 'like' query.
     * Returns 10 divisions per page.
     */
    public function index(Request $request): JsonResponse
    {
        $divisions = Division::query()
            ->when($request->filled('name'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->name . '%');
            })
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Data divisi berhasil diambil',
            'data' => [
                'divisions' => $divisions->map(fn(Division $division) => [
                    'id' => $division->id,
                    'name' => $division->name,
                ]),
            ],
            'pagination' => [
                'current_page' => $divisions->currentPage(),
                'last_page' => $divisions->lastPage(),
                'per_page' => $divisions->perPage(),
                'total' => $divisions->total(),
                'from' => $divisions->firstItem(),
                'to' => $divisions->lastItem(),
            ],
        ]);
    }
}
