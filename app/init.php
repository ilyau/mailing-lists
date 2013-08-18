<?php

function __autoload($class_name) {

	if(strpos($class_name, "Model") !== false)
	    include dirname(__FILE__) . '/models/' . $class_name . '.php';
	else if(strpos($class_name, "Controller") !== false)
	    include dirname(__FILE__) . '/controllers/' . $class_name . '.php';
	else
	    include dirname(__FILE__) . '/' . $class_name . '.php';

}

$config = dirname(__FILE__) . '/config.php';

App::create($config);
