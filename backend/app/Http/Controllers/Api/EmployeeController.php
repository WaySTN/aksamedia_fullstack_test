<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEmployeeRequest;
use App\Http\Requests\Api\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Handles employee CRUD operations.
 *
 * Provides full create, read, update, and delete functionality
 * for employee records, including image upload management.
 */
class EmployeeController extends Controller
{
    /**
     * Display a paginated listing of employees.
     *
     * Supports optional filtering by name and division_id.
     * Eager loads the division relationship to avoid N+1 queries.
     */
    public function index(Request $request): JsonResponse
    {
        $employees = Employee::with('division')
            ->when($request->filled('name'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->name . '%');
            })
            ->when($request->filled('division_id'), function ($query) use ($request) {
                $query->where('division_id', $request->division_id);
            })
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diambil',
            'data' => [
                'employees' => $employees->map(fn(Employee $employee) => [
                    'id' => $employee->id,
                    'image' => $employee->image ? url('storage/' . $employee->image) : null,
                    'name' => $employee->name,
                    'phone' => $employee->phone,
                    'division' => [
                        'id' => $employee->division->id,
                        'name' => $employee->division->name,
                    ],
                    'position' => $employee->position,
                ]),
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
     * Store a newly created employee in storage.
     *
     * Handles image upload to the 'employees' directory on the public disk.
     * Validation is handled by StoreEmployeeRequest.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'division_id' => $request->division,
            'position' => $request->position,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('employees', 'public');
        }

        Employee::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil ditambahkan',
        ], 201);
    }

    /**
     * Update the specified employee in storage.
     *
     * Supports partial updates using validated data.
     * Replaces old image on the public disk when a new one is uploaded.
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

        $data = collect($request->validated())
            ->when($request->has('division'), function ($collection) {
                return $collection->put('division_id', $collection->pull('division'));
            })
            ->except('image')
            ->toArray();

        if ($request->hasFile('image')) {
            // Delete old image before storing the new one
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $data['image'] = $request->file('image')->store('employees', 'public');
        }

        $employee->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diperbarui',
        ]);
    }

    /**
     * Remove the specified employee from storage.
     *
     * Also deletes the associated image file from the public disk.
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

        // Clean up the image file before deleting the record
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
