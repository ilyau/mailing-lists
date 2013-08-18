<?php

class SubscribersController extends CrudController {
	
	public function readAction() {
		
		$subscriber = new SubscriberModel();
		
		$result = $subscriber->read();

		echo json_encode($result);

	}
	public function createAction() {
		
		$response = new Response();

		$data = json_decode($_REQUEST['data'], true);

		$subscriber = new SubscriberModel();
		$result = $subscriber->create($data);

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

		$subscriber = new SubscriberModel();
		$result = $subscriber->destroy((int) $data);

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
		
		$subscriber = new SubscriberModel();
		$result = $subscriber->update($id, $data);
		
		if($result) {
			$response->success = true;
			$response->message = "Updated record";
			$response->data = $data;
		}

		echo $response->to_json();
	}
}