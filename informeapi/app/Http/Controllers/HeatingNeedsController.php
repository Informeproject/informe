<?php
namespace App\Http\Controllers;

use App\HeatingNeed;

class HeatingNeedsController extends Controller
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
     * Gets the heating needs of a consumer
     * @param type $TargetID
     */
    public function Index($TargetID)
    {
        if(!HeatingNeed::find($TargetID))
            return Tools::error('target not found',404);
        $value = HeatingNeed::where('id',$TargetID)->with('consumer')->first();
        return response()->json($value);
    }
    
}
