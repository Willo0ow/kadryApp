<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\User;

class UserController extends Controller
{
    protected $fillable = ['name', 'email', 'password', 'role'];
    public function user(){
        return Auth::user();
    }
    public function logout(){
        return redirect('/')->with(Auth::logout());
    }
    public function index(){
        return User::all();
    }
}
