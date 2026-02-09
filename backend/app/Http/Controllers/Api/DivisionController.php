<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    /**
     * Get all divisions with optional filter
     */
    public function index(Request $request): JsonResponse
    {
        $query = Division::query();

        // Filter by name
        if ($request->has('name') && $request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Paginate results
        $divisions = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Data divisi berhasil diambil',
            'data' => [
                'divisions' => $divisions->map(function ($division) {
                    return [
                        'id' => $division->id,
                        'name' => $division->name,
                    ];
                }),
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
