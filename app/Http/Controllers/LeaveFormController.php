<?php

namespace App\Http\Controllers;

use App\LeaveForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaveFormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $range = $_GET['range'];
        $data = $_GET['data'];
        if($range == 'empl'){
            return DB::table('leave_forms')
            ->join('employees', 'leave_forms.empl_id', '=', 'employees.id')
            ->select('leave_forms.*', 'employees.name')
            ->where('leave_forms.empl_id', $data)
            ->orderBy('leave_forms.date_start', 'asc')
            ->get();
        } elseif($range == 'dept'){
            return DB::table('leave_forms')
            ->join('employees', 'leave_forms.empl_id', '=', 'employees.id')
            ->select('leave_forms.*', 'employees.name')
            ->where('leave_forms.dept', $data)
            ->where('leave_forms.status', '<>', 'draft')
            ->orderBy('leave_forms.date_start', 'asc')
            ->get();
        }
        return DB::table('leave_forms')
        ->join('employees', 'leave_forms.empl_id', '=', 'employees.id')
        ->select('leave_forms.*', 'employees.name')
        ->orderBy('leave_forms.date_start', 'asc')
        ->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        LeaveForm::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\LeaveForm  $leaveForm
     * @return \Illuminate\Http\Response
     */
    public function show(LeaveForm $leaveForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\LeaveForm  $leaveForm
     * @return \Illuminate\Http\Response
     */
    public function edit(LeaveForm $leaveForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\LeaveForm  $leaveForm
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        LeaveForm::find($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\LeaveForm  $leaveForm
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        LeaveForm::find($id)->delete();
    }
}
