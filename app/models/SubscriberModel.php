<?php

class SubscriberModel extends Model
{
    protected $table_name = "subscriber";
    protected $attributes = array('first_name', 'last_name', 'email', 'id_list'); // all attributes without id
}
