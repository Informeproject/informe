<?php 
namespace App;
use App\App;
use Illuminate\Http\Request;
class Tools{
	// validate values
	public static function error($t,$c = 200) { 
        return response()->json(['error' => $t],$c);
    }
    
}