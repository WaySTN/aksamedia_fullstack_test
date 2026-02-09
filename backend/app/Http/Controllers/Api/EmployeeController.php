<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEmployeeRequest;
use App\Http\Requests\Api\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Get all employees with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::with('division');

        // Filter by name
        if ($request->has('name') && $request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Filter by division
        if ($request->has('division_id') && $request->division_id) {
            $query->where('division_id', $request->division_id);
        }

        // Paginate results
        $employees = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diambil',
            'data' => [
                'employees' => $employees->map(function ($employee) {
                    return [
                        'id' => $employee->id,
                        'image' => $employee->image ? url('storage/' . $employee->image) : null,
                        'name' => $employee->name,
                        'phone' => $employee->phone,
                        'division' => [
                            'id' => $employee->division->id,
                            'name' => $employee->division->name,
                        ],
                        'position' => $employee->position,
                    ];
                }),
            ],
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created employee
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'division_id' => $request->division,
            'position' => $request->position,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('employees', 'public');
            $data['image'] = $path;
        }

        Employee::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil ditambahkan',
        ], 201);
    }

    /**
     * Update the specified employee
     */
    public function update(UpdateEmployeeRequest $request, string $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data karyawan tidak ditemukan',
            ], 404);
        }

        $data = [];

        if ($request->has('name')) {
            $data['name'] = $request->name;
        }
        if ($request->has('phone')) {
            $data['phone'] = $request->phone;
        }
        if ($request->has('division')) {
            $data['division_id'] = $request->division;
        }
        if ($request->has('position')) {
            $data['position'] = $request->position;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $path = $request->file('image')->store('employees', 'public');
            $data['image'] = $path;
        }

        $employee->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diperbarui',
        ]);
    }

    /**
     * Remove the specified employee
     */
    public function destroy(string $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data karyawan tidak ditemukan',
            ], 404);
        }

        // Delete image if exists
        if ($employee->image) {
            Storage::disk('public')->delete($employee->image);
        }

        $employee->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil dihapus',
        ]);
    }
}
