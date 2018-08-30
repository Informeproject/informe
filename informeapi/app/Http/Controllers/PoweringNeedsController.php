<?php
namespace App\Http\Controllers;

use App\PoweringNeed;

class PoweringNeedsController extends Controller
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
     * Gets the power needs of a consumer
     * @param type $TargetID
     */
    public function Index($TargetID)
    {
        $value = PoweringNeed::find($TargetID);
        return response()->json($value);
    }
    
}
