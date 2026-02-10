<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEmployeeRequest;
use App\Http\Requests\Api\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles employee CRUD operations.
 *
 * Provides full create, read, update, and delete functionality
 * for employee records, including image upload management.
 * Images are stored as base64 data URLs in the database to support
 * serverless deployments (e.g., Vercel) with read-only filesystems.
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
                    'image' => $employee->image,
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
     * Convert an uploaded image file to a base64 data URL string.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @return string  Base64-encoded data URL (e.g., data:image/jpeg;base64,...)
     */
    private function imageToBase64($file): string
    {
        $mimeType = $file->getMimeType();
        $content = file_get_contents($file->getRealPath());
        return 'data:' . $mimeType . ';base64,' . base64_encode($content);
    }

    /**
     * Store a newly created employee in storage.
     *
     * Handles image upload by converting to base64 data URL.
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
            $data['image'] = $this->imageToBase64($request->file('image'));
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
     * Replaces old image with new base64 data URL when uploaded.
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
            $data['image'] = $this->imageToBase64($request->file('image'));
        }

        $employee->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diperbarui',
        ]);
    }

    /**
     * Remove the specified employee from storage.
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

        $employee->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil dihapus',
        ]);
    }
}
