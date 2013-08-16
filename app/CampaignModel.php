<?php

class CampaignModel extends Model {

	protected $table_name = "campaign";
	protected $attributes = array('name', 'description', 'id_list', 'id_template'); // all attributes without id
	
}