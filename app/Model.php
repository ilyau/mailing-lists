<?php

class Model {
	
	protected $table_name;
	protected $attributes;

	private function getSetString($attributes) {

		foreach($this->attributes as $i => $attr) {
			if(isset($attributes[$attr])) {
				$sql .= " {$attr}=:{$attr}";
				$sql .= count($this->attributes) == $i+1 ? '' : ',';

			} else {
				return false;
			}
		}

		return $sql;
	}

	private function getParamsArray($attributes) {
		$params = array();
		foreach($attributes as $index => $attr_value) {
			$params[':' . $index] = $attr_value;
		}
		return $params;
	}
	
	public function read() {
		
		$listRes = App::get()->db()->query('SELECT * FROM ' . $this->table_name);
		$listRes->setFetchMode(PDO::FETCH_ASSOC);

		$resultArr = array();

		while ($list = $listRes->fetch()) {
			$resultArr['data'][] = $list;
		}

		return $resultArr;

	}

	public function create(array $attributes) {
		
		$sql = 'INSERT INTO ' . $this->table_name . ' SET' . $this->getSetString($attributes);
		
		foreach($this->attributes as $i => $attr) {
			if(isset($attributes[$attr])) {
				$sql .= " {$attr}=:{$attr}";
				$sql .= count($this->attributes) == $i+1 ? '' : ',';

			} else {
				return "error: attribute $attr not found";
			}
		}

		$command = App::get()->db()->prepare($sql);

		return $command->execute(getParamsArray($attributes));
	}

	public function destroy($id) {

		$result = App::get()->db()->exec('DELETE FROM ' . $this->table_name . ' WHERE id=' . (int) $id);

		return $result;
	}
	
	public function update($id, $attributes) {

		if(isset($attributes['id']))
			unset($attributes['id']);

		$response = new Response();
		
		$data = json_decode($_REQUEST['data'], true);
		
		$command = App::get()->db()->prepare('UPDATE ' . $this->table_name . ' SET' . $this->getSetString($attributes) .' WHERE id=' . (int) $id );
		
		return $result = $command->execute(getParamsArray($attributes));
	}

}