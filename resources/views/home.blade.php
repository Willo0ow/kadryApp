@extends('layouts.app')

@section('content')
<div id="app">
    <v-app>
        <mainnav></mainnav>
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</div>
@endsection
