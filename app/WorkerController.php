<?php

/**
 * Description of WorkerController
 *
 * @author user
 */
class WorkerController extends Controller {

	public function runAction() {

		$response = new Response;
		
		if(isset($_REQUEST['id']) && is_numeric($_REQUEST['id'])) {
			$campaign_id = (int) $_REQUEST['id'];
		} else {
			$response->success = false;
			$response->message = "Выберите кампанию";
			echo $response->to_json();
			exit;
		}

		App::get()->db()->exec('UPDATE campaign SET status="running" WHERE id=' . $campaign_id );

		$client = new GearmanClient();
		$client->addServer();

		// get subscribers
		$cmd = App::get()->db()->prepare('SELECT * FROM subscriber WHERE id_list=(SELECT id_list FROM campaign WHERE id=:id)');
		$cmd->bindParam(':id', $campaign_id);
		$cmd->execute();

		$cmd->setFetchMode(PDO::FETCH_ASSOC);
		$subscribers = $cmd->fetchAll();

		foreach($subscribers as $s) {

			$cmd = App::get()->db()->prepare('INSERT INTO task SET id_campaign=:id_campaign, status="waiting"');
			$r = $cmd->execute(array(':id_campaign' => $campaign_id));
			$task_id =  App::get()->db()->lastInsertId();

			$s['campaign_id'] = $campaign_id;
			$s['task_id']     = $task_id;

			$task = $client->addTaskBackground("sendMail", serialize($s), null, $task_id);
		}
		
		$client->runTasks();

		$response->success = true;
		$response->message = "Кампания запущена";

		echo $response->to_json();
	}

	public function testAction()
	{
		$r = App::get()->db()->exec('UPDATE campaign SET status="complete" WHERE id=11');

		var_dump($r);
	}

}
