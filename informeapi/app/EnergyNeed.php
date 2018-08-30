<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EnergyNeed extends Model 
{
    public function consumer()
    {
        return $this->hasOne('App\ConsumerTarget','id', 'id');
    }
}
