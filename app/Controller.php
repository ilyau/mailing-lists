<?php

/**
 * Description of Controller
 *
 * @author user
 */
abstract class Controller {
	
	abstract public function readAction();
	abstract public function createAction();
	abstract public function destroyAction();
	abstract public function updateAction();
}
