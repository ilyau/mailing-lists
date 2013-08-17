<?php

class Worker {

	public function run() {
		
		echo "Starting\n";

		$worker = new GearmanWorker();
		$worker->addServer();
		$worker->addFunction("sendMail", array('Worker', 'sendMail'));

		while ($worker->work()) {
			if ($worker->returnCode() != GEARMAN_SUCCESS) {
				echo "return_code: " . $worker->returnCode() . "\n";
				break;
			}
		}
	}
	
	public function sendMail($job) {

		$data = unserialize($job->workload());
		App::get()->db()->exec('UPDATE task SET status="running" WHERE id=' . (int) $data['task_id'] );

		// отправка письма
		sleep(5);

		App::get()->db()->exec('UPDATE task SET status="done" WHERE id=' . (int) $data['task_id'] );
	}
}
