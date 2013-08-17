<?php

class CampaignsController extends CrudController {
	public function readAction() {
		
		$campaign = new CampaignModel();
		$result = $campaign->read();

		echo json_encode($result);

	}
	public function createAction() {
		
		$response = new Response();
		$data = json_decode($_REQUEST['data'], true);

		$campaign = new CampaignModel;
		$result = $campaign->create($data);

		if ($result) {

			$response->success = true;
			$response->message = "Created record";
			$response->data = array_merge(array('id' => App::get()->db()->lastInsertId()), $data);
		} else {
			$response->success = false;
		}

		echo $response->to_json();
	}
	
	public function destroyAction() {
		$response = new Response();

		$data = json_decode($_REQUEST['data'], true);

		$campaign = new CampaignModel();
		$result = $campaign->destroy((int) $data);

		if ($result) {
			$response->success = true;
			$response->message = "Removed campaign";
		} else {
			$response->success = false;
		}

		echo $response->to_json();
	}
	public function updateAction() {
		$response = new Response();
		
		$data = json_decode($_REQUEST['data'], true);
		
		$id = $data['id'];
		
		$campaign = new CampaignModel();
		$result = $campaign->update($id, $data);
		
		if($result) {
			$response->success = true;
			$response->message = "Updated record";
			$response->data = $data;
		}

		echo $response->to_json();
	}
}