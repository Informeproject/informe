<?php
namespace App\Http\Controllers;

use App\EnergyNeed;

class EnergyNeedsController extends Controller
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
        $value = EnergyNeed::where('id',$TargetID)->with('consumer')->first();
        return response()->json($value);
    }
    
}
