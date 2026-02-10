<?php

namespace App\Http\Requests\Api;

/**
 * Validates employee update requests.
 *
 * Uses 'sometimes' rule to allow partial updates —
 * only fields present in the request will be validated.
 */
class UpdateEmployeeRequest extends ApiFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'division' => 'sometimes|required|uuid|exists:divisions,id',
            'position' => 'sometimes|required|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'phone.required' => 'Nomor telepon wajib diisi',
            'division.required' => 'Divisi wajib dipilih',
            'division.exists' => 'Divisi tidak ditemukan',
            'position.required' => 'Posisi wajib diisi',
            'image.image' => 'File harus berupa gambar',
            'image.max' => 'Ukuran gambar maksimal 2MB',
        ];
    }
}
