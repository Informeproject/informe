<?php
namespace App\Http\Controllers;

use App\FuelingNeed;

class FuelingNeedsController extends Controller
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
     * Gets the fuel needs of a consumer
     * @param type $TargetID
     */
    public function Index($TargetID)
    {
        $value = FuelingNeed::find($TargetID);
        return response()->json($value);
    }
    
}
