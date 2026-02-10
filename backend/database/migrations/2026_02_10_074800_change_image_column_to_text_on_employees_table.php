<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Change image column from string to longText to support base64 encoded images.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->longText('image')->nullable()->change();
        });
    }

    /**
     * Reverse the migration.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('image')->nullable()->change();
        });
    }
};
