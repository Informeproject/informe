<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConsumerTarget extends Model 
{
    protected $casts = [
    'volume' => 'integer',
	];
}
