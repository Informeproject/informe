<?php
namespace App\Http\Controllers;

use App\WateringNeed;

class WateringNeedsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    /**
     * Gets the warm water needs of a target
     * @param type $TargetID
     */
    public function Index($TargetID)
    {
        $value = WateringNeed::find($TargetID);
        return response()->json($value);
    }
    
}
