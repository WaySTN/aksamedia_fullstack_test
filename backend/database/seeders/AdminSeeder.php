<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'phone' => '081234567890',
            'email' => 'admin@aksamedia.com',
            'password' => Hash::make('pastibisa'),
        ]);
    }
}
