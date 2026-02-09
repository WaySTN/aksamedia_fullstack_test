<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $divisions = Division::all();

        $employees = [
            ['name' => 'Budi Santoso', 'phone' => '081234567891', 'position' => 'Junior Developer'],
            ['name' => 'Siti Rahayu', 'phone' => '081234567892', 'position' => 'Senior Developer'],
            ['name' => 'Ahmad Wijaya', 'phone' => '081234567893', 'position' => 'Lead Developer'],
            ['name' => 'Dewi Lestari', 'phone' => '081234567894', 'position' => 'Quality Assurance'],
            ['name' => 'Rudi Hermawan', 'phone' => '081234567895', 'position' => 'UI Designer'],
            ['name' => 'Rina Kusuma', 'phone' => '081234567896', 'position' => 'UX Designer'],
            ['name' => 'Hendra Pratama', 'phone' => '081234567897', 'position' => 'DevOps Engineer'],
            ['name' => 'Maya Sari', 'phone' => '081234567898', 'position' => 'Project Manager'],
            ['name' => 'Doni Setiawan', 'phone' => '081234567899', 'position' => 'System Analyst'],
            ['name' => 'Fitri Handayani', 'phone' => '081234567800', 'position' => 'Technical Writer'],
            ['name' => 'Eko Prasetyo', 'phone' => '081234567801', 'position' => 'Mobile Developer'],
            ['name' => 'Nur Hidayah', 'phone' => '081234567802', 'position' => 'Frontend Developer'],
        ];

        foreach ($employees as $index => $employee) {
            Employee::create([
                'name' => $employee['name'],
                'phone' => $employee['phone'],
                'position' => $employee['position'],
                'division_id' => $divisions[$index % count($divisions)]->id,
                'image' => null,
            ]);
        }
    }
}
