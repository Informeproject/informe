<?php
namespace App\Http\Controllers;

use App\EnergyProduction;
use Illuminate\Http\Request;

class EnergyProductionsController extends Controller
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
     * Gets all the energy producers
     */
    
    public function Index(Request $request) 
    {
        $value = EnergyProduction::where(function($query) use ($request){
            if($request->has('materialcategory')) {
                $query->where('materialcategory',$request->materialcategory);
            }
            if($request->has('origin')) {
                $query->where('origin',$request->origin);
            }
            if($request->has('panelangle')) {
                $query->where('panelangle',$request->panelangle);
            }
            if($request->has('paneldirection')) {
                $query->where('paneldirection',$request->paneldirection);
            }
            if($request->has('energycategory')) {
                $query->where('energycategory',$request->energycategory);
            }
            if($request->has('heatingpowerkw')) {
                $query->where('heatingpowerkw',$request->heatingpowerkw);
            }
            if($request->has('heatingpowermin')) {
                $query->where('heatingpowermin',$request->heatingpowermin);
            }
            if($request->has('heatingpowermax')) {
                $query->where('heatingpowermax',$request->heatingpowermax);
            }
            if($request->has('heatkwhgross')) {
                $query->where('heatkwhgross',$request->heatkwhgross);
            }
            if($request->has('heatkwhnet')) {
                $query->where('heatkwhnet',$request->heatkwhnet);
            }
            if($request->has('electrpowerkw')) {
                $query->where('electrpowerkw',$request->electrpowerkw);
            }
            if($request->has('geothermlenght')) {
                $query->where('geothermlenght',$request->geothermlenght);
            }
            if($request->has('geothermunit')) {
                $query->where('geothermunit',$request->geothermunit);
            }
			if($request->has('description')) {
                $query->where('description',$request->description);
            }
			if($request->has('description2')) {
                $query->where('description2',$request->description2);
            }
            if($request->has('solids')) {
                $query->where('solids',$request->solids);
            }
        })->select('materialcategory','materialcatname','origin','energysource','efficiency','method','panelangle','paneldirection','energycategory','inputamount','inputunit','geothermlenght','geothermunit','heatingpowerkw','heatingpowermin','heatingpowermax','solids','heatkwhgross','heatkwhnet','energyperunitkwh','electrpowerkw','heatingpowerkw','description','description2','proddescription','proddescriptionunit','heatjanuary','heatfebruary','heatmarch','heatapril','heatmay','heatjune','heatjuly','heatjune','heataugust','heatseptember','heatoctober','heatnovember','heatdecember','electjanuary','electfebruary','electmarch','electapril','electmay','electjune','electjuly','electaugust','electseptember','electoctober','electnovember','electdecember')->orderBy('materialcategory','asc')->get();
        return response()->json($value);
    }
    /**
     * Gets specific energy producer data
     * @param type $ID
     */
    public function Show($CategoryID)
    {
        $value = EnergyProduction::find($CategoryID);
        return response()->json($value);
    }
    
    public function Update($CategoryID) 
    {
        $producer = EnergyProduction::find('materialcategory',$CategoryID);
        
        if(!$producer)
            return Tools::error('producer not found',404);
        
        if($request->has("materialcategory"))
            $producer->materialcategory = $request->materialcategory;
        if($request->has("materialcatname"))
            $producer->materialcatname = $request->materialcatname;    
        if($request->has("origin"))
            $producer->origin = $request->origin;
        if($request->has("energysource"))
            $producer->energysource = $request->energysource;
        if($request->has("method"))
            $producer->method = $request->method;
        if($request->has("panelangle"))
            $producer->panelangle = $request->panelangle;
        if($request->has("paneldirection"))
            $producer->paneldirection = $request->paneldirection;
        if($request->has("energycategory"))
            $producer->energycategory = $request->energycategory;
        if($request->has("gaspowerkw"))
            $producer->gaspowerkw = $request->gaspowerkw;
        if($request->has("heatingpowerkw"))
            $producer->heatingpowerkw = $request->heatingpowerkw;
        if($request->has("heatingpowermin"))
            $producer->heatingpowermin = $request->heatingpowermin;
        if($request->has("heatingpowermax"))
            $producer->heatingpowermax = $request->heatingpowermax;
        if($request->has("electrpowerkw"))
            $producer->electrpowerkw = $request->electrpowerkw;
        if($request->has("prodexpect"))
            $producer->prodexpect = $request->prodexpect;
        if($request->has("heatkwhgross"))
            $producer->heatkwhgross = $request->heatkwhgross;
        if($request->has("heatkwhnet"))
            $producer->heatkwhnet = $request->heatkwhnet;
        if($request->has("electrkwh"))
            $producer->electrkwh = $request->electrkwh;
        if($request->has("vehiclefuel"))
            $producer->vehiclefuel = $request->vehiclefuel;
        if($request->has("energyperunitkwh"))
            $producer->energyperunitkwh = $request->energyperunitkwh;
        if($request->has("unit"))
            $producer->unit = $request->unit;
        if($request->has("inputamount"))
            $producer->inputamount = $request->inputamount;
        if($request->has("inputunit"))
            $producer->inputunit = $request->inputunit;
        if($request->has("geothermlenght"))
            $producer->geothermlenght = $request->geothermlenght;
        if($request->has("geothermunit"))
            $producer->geothermunit = $request->geothermunit;
        if($request->has("dampness"))
            $producer->dampness = $request->dampness;   
        if($request->has("solids"))
            $producer->solids = $request->solids;
        if($request->has("vsp"))
            $producer->vsp = $request->vsp;
        if($request->has("description"))
            $producer->description = $request->description;
        if($request->has("description2"))
            $producer->description2 = $request->description2;
        if($request->has("proddescription"))
            $producer->proddescription = $request->proddescription;
        if($request->has("proddescriptionunit"))
            $producer->proddescriptionunit = $request->proddescriptionunit;
        if($request->has("heatjanuary"))
            $producer->heatjanuary = $request->heatjanuary;
        if($request->has("heatfebruary"))
            $producer->heatfebruary = $request->heatfebruary;
        if($request->has("heatmarch"))
            $producer->heatmarch = $request->heatmarch;
        if($request->has("heatapril"))
            $producer->heatapril = $request->heatapril;
        if($request->has("heatmay"))
            $producer->heatmay = $request->heatmay;
        if($request->has("heatjune"))
            $producer->heatjune = $request->heatjune;
        if($request->has("heatjuly"))
            $producer->heatjuly = $request->heatjuly;
        if($request->has("heataugust"))
            $producer->heataugust = $request->heataugust;
        if($request->has("heatseptember"))
            $producer->heatseptember = $request->heatseptember;
        if($request->has("heatoctober"))
            $producer->heatoctober = $request->heatoctober;
        if($request->has("heatnovember"))
            $producer->heatnovember = $request->heatnovember;
        if($request->has("heatdecember"))
            $producer->heatdecember = $request->heatdecember;
        if($request->has("biogastotaloutput"))
            $producer->biogastotaloutput = $request->biogastotaloutput;  
        if($request->has("biogasselfuseheat"))
            $producer->biogasselfuseheat = $request->biogasselfuseheat;
        if($request->has("netheatkwh"))
            $producer->netheatkwh = $request->netheatkwh;
        if($request->has("biogasselfuseelect"))
            $producer->biogasselfuseelect = $request->biogasselfuseelect;
        if($request->has("electjanuary"))
            $producer->electjanuary = $request->electjanuary;
        if($request->has("electfebruary"))
            $producer->electfebruary = $request->electfebruary;
        if($request->has("electmarch"))
            $producer->electmarch = $request->electmarch;
        if($request->has("electapril"))
            $producer->electapril = $request->electapril;
        if($request->has("electmay"))
            $producer->electmay = $request->electmay;
        if($request->has("electjune"))
            $producer->electjune = $request->electjune;
        if($request->has("electjuly"))
            $producer->electjuly = $request->electjuly;
        if($request->has("electaugust"))
            $producer->electaugust = $request->electaugust;
        if($request->has("electseptember"))
            $producer->electseptember = $request->electseptember;
        if($request->has("electoctober"))
            $producer->electoctober = $request->electoctober;
        if($request->has("electnovember"))
            $producer->electnovember = $request->electnovember;
        if($request->has("electdecember"))
            $producer->electdecember = $request->electdecember;
        
        $producer->save();
        return response()->json(['updated' => true]);
    }
    
    public function Store()
    {
        $producer = new ProducerTarget;
        
        if(!$producer)
            return Tools::error('producer not found',404);
        
            if($request->has("materialcategory"))
            $producer->materialcategory = $request->materialcategory;
        if($request->has("materialcatname"))
            $producer->materialcatname = $request->materialcatname;    
        if($request->has("origin"))
            $producer->origin = $request->origin;
        if($request->has("energysource"))
            $producer->energysource = $request->energysource;
        if($request->has("method"))
            $producer->method = $request->method;
        if($request->has("panelangle"))
            $producer->panelangle = $request->panelangle;
        if($request->has("paneldirection"))
            $producer->paneldirection = $request->paneldirection;
        if($request->has("energycategory"))
            $producer->energycategory = $request->energycategory;
        if($request->has("gaspowerkw"))
            $producer->gaspowerkw = $request->gaspowerkw;
        if($request->has("heatingpowerkw"))
            $producer->heatingpowerkw = $request->heatingpowerkw;
        if($request->has("heatingpowermin"))
            $producer->heatingpowermin = $request->heatingpowermin;
        if($request->has("heatingpowermax"))
            $producer->heatingpowermax = $request->heatingpowermax;
        if($request->has("electrpowerkw"))
            $producer->electrpowerkw = $request->electrpowerkw;
        if($request->has("prodexpect"))
            $producer->prodexpect = $request->prodexpect;
        if($request->has("heatkwhgross"))
            $producer->heatkwhgross = $request->heatkwhgross;
        if($request->has("heatkwhnet"))
            $producer->heatkwhnet = $request->heatkwhnet;
        if($request->has("electrkwh"))
            $producer->electrkwh = $request->electrkwh;
        if($request->has("vehiclefuel"))
            $producer->vehiclefuel = $request->vehiclefuel;
        if($request->has("energyperunitkwh"))
            $producer->energyperunitkwh = $request->energyperunitkwh;
        if($request->has("unit"))
            $producer->unit = $request->unit;
        if($request->has("inputamount"))
            $producer->inputamount = $request->inputamount;
        if($request->has("inputunit"))
            $producer->inputunit = $request->inputunit;
        if($request->has("geothermlenght"))
            $producer->geothermlenght = $request->geothermlenght;
        if($request->has("geothermunit"))
            $producer->geothermunit = $request->geothermunit;
        if($request->has("dampness"))
            $producer->dampness = $request->dampness;   
        if($request->has("solids"))
            $producer->solids = $request->solids;
        if($request->has("vsp"))
            $producer->vsp = $request->vsp;
        if($request->has("description"))
            $producer->description = $request->description;
        if($request->has("description2"))
            $producer->description2 = $request->description2;
        if($request->has("proddescription"))
            $producer->proddescription = $request->proddescription;
        if($request->has("proddescriptionunit"))
            $producer->proddescriptionunit = $request->proddescriptionunit;
        if($request->has("heatjanuary"))
            $producer->heatjanuary = $request->heatjanuary;
        if($request->has("heatfebruary"))
            $producer->heatfebruary = $request->heatfebruary;
        if($request->has("heatmarch"))
            $producer->heatmarch = $request->heatmarch;
        if($request->has("heatapril"))
            $producer->heatapril = $request->heatapril;
        if($request->has("heatmay"))
            $producer->heatmay = $request->heatmay;
        if($request->has("heatjune"))
            $producer->heatjune = $request->heatjune;
        if($request->has("heatjuly"))
            $producer->heatjuly = $request->heatjuly;
        if($request->has("heataugust"))
            $producer->heataugust = $request->heataugust;
        if($request->has("heatseptember"))
            $producer->heatseptember = $request->heatseptember;
        if($request->has("heatoctober"))
            $producer->heatoctober = $request->heatoctober;
        if($request->has("heatnovember"))
            $producer->heatnovember = $request->heatnovember;
        if($request->has("heatdecember"))
            $producer->heatdecember = $request->heatdecember;
        if($request->has("biogastotaloutput"))
            $producer->biogastotaloutput = $request->biogastotaloutput;  
        if($request->has("biogasselfuseheat"))
            $producer->biogasselfuseheat = $request->biogasselfuseheat;
        if($request->has("netheatkwh"))
            $producer->netheatkwh = $request->netheatkwh;
        if($request->has("biogasselfuseelect"))
            $producer->biogasselfuseelect = $request->biogasselfuseelect;
        if($request->has("electjanuary"))
            $producer->electjanuary = $request->electjanuary;
        if($request->has("electfebruary"))
            $producer->electfebruary = $request->electfebruary;
        if($request->has("electmarch"))
            $producer->electmarch = $request->electmarch;
        if($request->has("electapril"))
            $producer->electapril = $request->electapril;
        if($request->has("electmay"))
            $producer->electmay = $request->electmay;
        if($request->has("electjune"))
            $producer->electjune = $request->electjune;
        if($request->has("electjuly"))
            $producer->electjuly = $request->electjuly;
        if($request->has("electaugust"))
            $producer->electaugust = $request->electaugust;
        if($request->has("electseptember"))
            $producer->electseptember = $request->electseptember;
        if($request->has("electoctober"))
            $producer->electoctober = $request->electoctober;
        if($request->has("electnovember"))
            $producer->electnovember = $request->electnovember;
        if($request->has("electdecember"))
            $producer->electdecember = $request->electdecember;
        
        $producer->save();
        return response()->json(['created' => true]);
    }
}
