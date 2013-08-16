<?php

class ListsController extends Controller {
	
	public function readAction() {
		
		$listRes = App::get()->db()->query('SELECT * FROM list');
		$listRes->setFetchMode(PDO::FETCH_ASSOC);

		$resultArr = array();

		while ($list = $listRes->fetch()) {
			$resultArr['data'][] = $list;
		}

		echo json_encode($resultArr);

	}
	public function createAction() {
		
		$response = new Response();

		$data = json_decode($_REQUEST['data'], true);

		$list = new ListModel();
		$result = $list->create($data);

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

		$list = new ListModel();
		$result = $list->destroy((int) $data);

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
		
		$list = new ListModel();
		$result = $list->update($id, $data);
		
		if($result) {
			$response->success = true;
			$response->message = "Updated record";
			$response->data = $data;
		}

		echo $response->to_json();
	}
}