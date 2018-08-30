<?php
namespace App\Http\Controllers;

use App\ConsumerTarget;
use Illuminate\Http\Request;

class ConsumerTargetsController extends Controller
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
     * Gets all consumer targets
     */
    public function Index(Request $request)
    {
        if(!$request->has('type'))
            $value = ConsumerTarget::all();
        else
            if($request->has('id'))
                $value = ConsumerTarget::select('id','volumeDefinition','use','heatedarea_m2','type','heatingkw','electrkw')->where('type',$request->type)->orderBy('id','asc')->get();
            else
                $value = ConsumerTarget::where('type',$request->type)->orderBy('id','asc')->get();
        return response()->json($value);
    }
    /**
     * Gets a specific consumer target data
     * @param type $ConsumerID
     */
    public function Show($ConsumerID)
    {
        $value = ConsumerTarget::find($ConsumerID);
        return response()->json($value);
    }

    /**
     * Updates a specific consumer target data
     * @param type $ConsumerID
     */
    public function Update($ConsumerID)
    {
        $consumer = ConsumerTarget::find('id',$ConsumerID);

        if(!$consumer)
            return Tools::error('consumer for found',404);

        if($request->has("type"))
            $consumer->type = $request->type;
        if($request->has("use"))
            $consumer->use = $request->use;
        if($request->has("volume"))
            $consumer->volume = $request->volume;
        if($request->has("definition"))
            $consumer->definition = $request->definition;
        if($request->has("notes"))
            $consumer->notes = $request->notes;
        if($request->has("ltrhlo"))
            $consumer->ltrhlo = $request->ltrhlo;
        if($request->has("vkrv"))
            $consumer->vkrv = $request->vkrv;
        if($request->has("hlo"))
            $consumer->hlo = $request->hlo;
        if($request->has("heatingkwhm3"))
            $consumer->heatingkwhm3 = $request->heatingkwhm3;
        if($request->has("lkvkwhm2"))
            $consumer->lkvkwhm2 = $request->lkvkwhm2;
        if($request->has("sahkwhm2"))
            $consumer->sahkwhm2 = $request->sahkwhm2;
        if($request->has("heatedaream2"))
            $consumer->heatedaream2 = $request->heatedaream2;
        if($request->has("totalarea"))
            $consumer->totalarea = $request->totalarea;
        if($request->has("height"))
            $consumer->height = $request->height;
        if($request->has("powerneed"))
            $consumer->powerneed = $request->powerneed;
        if($request->has("kwhm3"))
            $consumer->kwhm3 = $request->kwhm3;
        if($request->has("calcheating"))
            $consumer->calcheating = $request->calcheating;
        if($request->has("heatingkwh"))
            $consumer->heatingkwh = $request->heatingkwh;
        if($request->has("lkvkwh"))
            $consumer->lkvkwh = $request->lkvkwh;
        if($request->has("equipmentkwh"))
            $consumer->equipmentkwh = $request->equipmentkwh;
        if($request->has("vehiclefuelkwh"))
            $consumer->vehiclefuelkwh = $request->vehiclefuelkwh;
        if($request->has("totalkwh"))
            $consumer->totalkwh = $request->totalkwh;
        if($request->has("kwhm2"))
            $consumer->kwhm2 = $request->kwhm2;
        if($request->has("heatingkw"))
            $consumer->heatingkw = $request->heatingkw;
        if($request->has("electrkw"))
            $consumer->electrkw = $request->electrkw;
        if($request->has("heatinginpractice"))
            $consumer->heatinginpractice = $request->heatinginpractice;
        if($request->has("x"))
            $consumer->x = $request->x;
        if($request->has("selectedkw"))
            $consumer->type = $request->type;
        if($request->has("amount"))
            $consumer->amount = $request->amount;
        if($request->has("combinedheating"))
            $consumer->combinedheating = $request->combinedheating;
        if($request->has("electrinpractice"))
            $consumer->electrinpractice = $request->electrinpractice;


        $consumer->save();
        return response()->json(['updated' => true]);
        //return response()->json($value);
    }

    /**
     * Creates new consumer
     * @param type $ConsumerID
     */
    public function Store()
    {
        $consumer = new ConsumerTarget;

        if(!$consumer)
            return Tools::error('consumer for found',404);

        if($request->has("type"))
            $consumer->type = $request->type;
        if($request->has("use"))
            $consumer->use = $request->use;
        if($request->has("volume"))
            $consumer->volume = $request->volume;
        if($request->has("definition"))
            $consumer->definition = $request->definition;
        if($request->has("notes"))
            $consumer->notes = $request->notes;
        if($request->has("ltrhlo"))
            $consumer->ltrhlo = $request->ltrhlo;
        if($request->has("vkrv"))
            $consumer->vkrv = $request->vkrv;
        if($request->has("hlo"))
            $consumer->hlo = $request->hlo;
        if($request->has("heatingkwhm3"))
            $consumer->heatingkwhm3 = $request->heatingkwhm3;
        if($request->has("lkvkwhm2"))
            $consumer->lkvkwhm2 = $request->lkvkwhm2;
        if($request->has("sahkwhm2"))
            $consumer->sahkwhm2 = $request->sahkwhm2;
        if($request->has("heatedaream2"))
            $consumer->heatedaream2 = $request->heatedaream2;
        if($request->has("totalarea"))
            $consumer->totalarea = $request->totalarea;
        if($request->has("height"))
            $consumer->height = $request->height;
        if($request->has("powerneed"))
            $consumer->powerneed = $request->powerneed;
        if($request->has("kwhm3"))
            $consumer->kwhm3 = $request->kwhm3;
        if($request->has("calcheating"))
            $consumer->calcheating = $request->calcheating;
        if($request->has("heatingkwh"))
            $consumer->heatingkwh = $request->heatingkwh;
        if($request->has("lkvkwh"))
            $consumer->lkvkwh = $request->lkvkwh;
        if($request->has("equipmentkwh"))
            $consumer->equipmentkwh = $request->equipmentkwh;
        if($request->has("vehiclefuelkwh"))
            $consumer->vehiclefuelkwh = $request->vehiclefuelkwh;
        if($request->has("totalkwh"))
            $consumer->totalkwh = $request->totalkwh;
        if($request->has("kwhm2"))
            $consumer->kwhm2 = $request->kwhm2;
        if($request->has("kw"))
            $consumer->kw = $request->kw;
        if($request->has("inpractice"))
            $consumer->inpractice = $request->inpractice;
        if($request->has("x"))
            $consumer->x = $request->x;
        if($request->has("selectedkw"))
            $consumer->type = $request->type;
        if($request->has("amount"))
            $consumer->amount = $request->amount;
        if($request->has("combinedheating"))
            $consumer->combinedheating = $request->combinedheating;

        $consumer->save();
        return response()->json(['created' => true]);
        //return response()->json($value);
    }
    
}
