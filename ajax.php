<?php

require dirname(__FILE__) . '/app/init.php';

header('Content-type: application/json');

// crud operations
if (isset($_REQUEST['type']) && isset($_REQUEST['act'])) {

	$class = $_REQUEST['type'] . 'Controller';
	$method = $_REQUEST['act'] . 'Action';

	$controller = new ReflectionClass($class);

	if ($controller->isSubclassOf('Controller')) {

		$reflectionMethod = new ReflectionMethod($class, $method);
		$reflectionMethod->invoke(new $class());
	} else {
		echo 'not subclass of controller';
	}
} else {
	echo "not exits type or act";
}