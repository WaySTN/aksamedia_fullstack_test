<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        $divisions = [
            'Mobile Apps',
            'QA',
            'Full Stack',
            'Backend',
            'Frontend',
            'UI/UX Designer',
        ];

        foreach ($divisions as $division) {
            Division::create(['name' => $division]);
        }
    }
}
