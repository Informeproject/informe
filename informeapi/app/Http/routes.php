<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->version();
});
/**
 * /consumers
 * Gets all the consumers that are available
 */
$app->get('/consumers', "ConsumerTargetsController@Index");
/**
 * /consumers/store
 * Store new consumer
 */
$app->post('/consumers/store', "ConsumerTargetsController@Store");
/**
 * /consumers/{id}
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/store
 */
$app->get('/consumers/{ID}', "ConsumerTargetsController@Show");

/**
 * /consumers/{id}/update
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/1/update
 */
$app->put('/consumers/{ID}/update', "ConsumerTargetsController@Update");

/**
 * /consumers/{id}/heating
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/1/heating
 * Gets data of how much heating is needed monthly by specified consumer.
 */
$app->get('/consumers/{ID}/heating', "HeatingNeedsController@Index");
/**
 * /consumers/{id}/fueling
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/1/fueling
 * Gets data of how much fuel is needed monthly by specified consumer.
 */
$app->get('/consumers/{ID}/fueling', "FuelingNeedsController@Index");
/**
 * /consumers/{id}/powering
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/1/powering
 * Gets data of how much device power is needed monthly by specified consumer.
 */
$app->get('/consumers/{ID}/powering', "PoweringNeedsController@Index");
/**
 * /consumers/{id}/energy
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/1/energy
 * Gets data of how much energy is needed monthly by 
 * specified consumers devices.
 */
$app->get('/consumers/{ID}/energy', "EnergyNeedsController@Index");
/**
 * /consumers/{id}/watering
 * ex. niisku.lamk.fi/~informe/informeapi/public/consumers/1/watering
 * Gets data of how much warm water is needed monthly by specified consumer.
 */
$app->get('/consumers/{ID}/watering', "WateringNeedsController@Index");

/**
 * /productions
 * Gets data from all available production targets
 */
$app->get('/productions', "EnergyProductionsController@Index");
/**
 * /productions
 * Gets data from all available production targets
 */
$app->post('/productions/store', "EnergyProductionsController@Store");

/**
 * /productions/{energycategory}
 * ex. niisku.lamk.fi/~informe/informeapi/public/productions/1
 * Gets data from specific production target specified by ID
 * 
 */
$app->get('/productions/{energycategory}', "EnergyProductionsController@Show");
/**
 * /productions/{energycategory}/update
 * ex. niisku.lamk.fi/~informe/informeapi/public/productions/1/update
 * 
 */

$app->put('/productions/{ID}/update', "EnergyProductionsController@Update");



