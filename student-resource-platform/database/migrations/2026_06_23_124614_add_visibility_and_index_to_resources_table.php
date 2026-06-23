<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('resources', function (Blueprint $table) {
        // 'private', 'pending', 'public'
        $table->string('visibility')->default('private'); 
        $table->index(['title', 'semester']); // Indexing for faster searching
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            //
        });
    }
};
