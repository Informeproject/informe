<?php
namespace App\Http\Controllers;

use App\ProductionTarget;
use Illuminate\Http\Request;

class ProductionTargetsController extends Controller
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
     * Gets all production targets capabilities
     */
    public function Index()
    {
        $value = ProductionTarget::all();
        return response()->json($value);
    }
    
    /**
     * Gets all cabalities of specific target
     * @param type $ProductionID
     */
    public function Show($ID)
    {
        $value = ProductionTarget::find($ID);
        return response()->json($value);
    }
    /**
     * Updates a specific production target data
     * @param type $ConsumerID
     */
    public function Update($ConsumerID)
    {
        $production = ProductionTarget::find('id',$ConsumerID);

        if(!$production)
            return Tools::error('production for found',404);

        if($request->has("fuel"))
            $production->fuel = $request->fuel;
        if($request->has("method"))
            $production->method = $request->method;
        if($request->has("outputkw"))
            $production->output_kw = $request->outputkw;
        if($request->has("heatingkwh"))
            $production->heating_kwh = $request->heatingkwh;
        if($request->has("chp_electricitykwh"))
            $production->chp_electricity_kwh = $request->chp_electricitykwh;
        if($request->has("chpheatingkwh"))
            $production->chpheatingkwh = $request->chp_heating_kwh;
        if($request->has("electricitykwh"))
            $production->electricity_kwh = $request->electricitykwh;
        if($request->has("vehiclefuel"))
            $production->vehiclefuel = $request->vehiclefuel;
        if($request->has("input"))
            $production->input = $request->input;
        if($request->has("dampness"))
            $production->dampness = $request->dampness;
        if($request->has("notes"))
            $production->notes = $request->notes;
        if($request->has("unit"))
            $production->unit = $request->unit;

        $production->save();
        return response()->json(['updated' => true]);
        //return response()->json($value);
    }

    /**
     * Creates new production target
     * @param type $ConsumerID
     */
    public function Store()
    {
        $production = new ProductionTarget;

        if(!$production)
            return Tools::error('consumer for found',404);

        if($production->has("fuel"))
            $production->fuel = $production->fuel;
        if($production->has("method"))
            $production->method = $production->method;
        if($production->has("outputkw"))
            $production->output_kw = $production->outputkw;
        if($production->has("heatingkwh"))
            $production->heating_kwh = $production->heatingkwh;
        if($production->has("chp_electricitykwh"))
            $production->chp_electricity_kwh = $production->chp_electricitykwh;
        if($production->has("chpheatingkwh"))
            $production->chpheatingkwh = $production->chp_heating_kwh;
        if($production->has("electricitykwh"))
            $production->electricity_kwh = $production->electricitykwh;
        if($production->has("vehiclefuel"))
            $production->vehiclefuel = $production->vehiclefuel;
        if($production->has("input"))
            $production->input = $production->input;
        if($production->has("dampness"))
            $production->dampness = $production->dampness;
        if($production->has("notes"))
            $production->notes = $production->notes;
        if($production->has("unit"))
            $production->unit = $production->unit;

        $production->save();
        return response()->json(['created' => true]);
        //return response()->json($value);
    }
}
