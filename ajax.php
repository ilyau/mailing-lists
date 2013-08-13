<?php

require dirname(__FILE__) . '/init.php';

header('Content-type: application/json');

if(isset($_REQUEST['act'])) {
	switch($_REQUEST['act']) {
		case 'read_campaigns':
			
			$campaignRes = $app->db()->query('SELECT * FROM campaign');
			$campaignRes->setFetchMode(PDO::FETCH_ASSOC);

			$resultArr = array();
			
			while($campaign = $campaignRes->fetch()) {
				$resultArr['data'][] = $campaign;
			}

			echo json_encode($resultArr);

			break;
			
		case 'write_campaigns':
			
			
			break;
			
		default:
			break;
	}
}