<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeaveFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leave_forms', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->integer('empl_id');
            $table->integer('user_id');
            $table->string('dept');
            $table->string('status');
            $table->date('date_start');
            $table->date('date_end');
            $table->date('date_sent')->nullable();
            $table->string('note')->nullable();
            $table->string('reject_msg')->nullable();
            $table->integer('sub');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('leave_forms');
    }
}
