<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Auth::routes();

Route::get('/user', 'UserController@user');
Route::get('/logout', 'UserController@logout');
Route::resource('/empls', 'EmployeeController');
Route::resource('/users', 'UserController');
Route::resource('/depts', 'DepartmentController');
Route::resource('/holis', 'HolidayController');
Route::post('/updateLeaveAdd', 'EmployeeController@updateLeaveAdd');

//Route::get('/home', 'HomeController@index')->name('home');
Route::get('/main/{any}','HomeController@index')->where('any', '.*');
