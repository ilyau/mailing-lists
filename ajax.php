<?php

require dirname(__FILE__) . '/app/init.php';

header('Content-type: application/json');

if (isset($_REQUEST['act'])) {
	switch ($_REQUEST['act']) {
		case 'read_campaigns':

			$campaignRes = $app->db()->query('SELECT * FROM campaign');
			$campaignRes->setFetchMode(PDO::FETCH_ASSOC);

			$resultArr = array();

			while ($campaign = $campaignRes->fetch()) {
				$resultArr['data'][] = $campaign;
			}

			echo json_encode($resultArr);

			break;

		case 'create_campaigns':

			$response = new Response();

			$data = json_decode($_REQUEST['data'], true);

			$name = $data['name'];
			$description = $data['description'];

			$command = $app->db()->prepare("INSERT INTO campaign SET name=:name, description=:description");
			$command->bindParam(':name', $name, PDO::PARAM_STR);
			$command->bindParam(':description', $description, PDO::PARAM_STR);
			$result = $command->execute();

			if ($result) {

				$response->success = true;
				$response->message = "Created record";
				$response->data = array_merge(array('id' => $app->db()->lastInsertId()), $data);
			} else {
				$response->success = false;
			}

			echo $response->to_json();

			break;

		case 'destroy_campaigns':

			$response = new Response();

			$data = json_decode($_REQUEST['data'], true);

			$result = $app->db()->exec('DELETE FROM	campaign WHERE id=' . (int) $data);

			if ($result) {
				$response->success = true;
				$response->message = "Removed campaign";
			} else {
				$response->success = false;
			}

			echo $response->to_json();

			break;

		case 'update_campaigns':

			$response = new Response();
			
			$data = json_decode($_REQUEST['data'], true);
			
			$command = $app->db()->prepare('UPDATE campaign SET name=:name, description=:description WHERE id=:id');
			$result = $command->execute(array(
									':id' => (int) $data['id'],
									':name' => $data['name'],
									':description' => $data['description']
								));
			
			if($result) {
				$response->success = true;
				$response->message = "Updated record";
				$response->data = $data;
			}

			echo $response->to_json();

			break;

		default:
			break;
	}
}