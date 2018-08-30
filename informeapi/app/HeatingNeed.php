<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HeatingNeed extends Model 
{
    public function consumer()
    {
        return $this->hasOne('App\ConsumerTarget','id', 'id');
    }

}
