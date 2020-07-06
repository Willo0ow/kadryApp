<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name'); //first and last name
            $table->string('position');
            $table->string('dept');//department
            $table->string('contract_type');
            $table->integer('user_id')->nullable();//user id matched with employee
            $table->integer('supervisor_id')->nullable();
            $table->integer('notice_period')->default(0);
            $table->integer('leave_base');
            $table->integer('leave_used')->default(0);
            $table->integer('leave_old')->default(0);
            $table->integer('leave_emerg')->default(0);
            $table->date('date_start'); // contract start date
            $table->date('date_end')->nullable(); // contract end date
            $table->date('date_notice')->nullable(); // date of notice application
            $table->boolean('leave_accum'); // true - leave accumulates every month
            $table->boolean('supervisor'); // employee is a supervisor
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
        Schema::dropIfExists('employees');
    }
}
