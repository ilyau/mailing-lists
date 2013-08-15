<?php

function __autoload($class_name) {
    include dirname(__FILE__) . '/' . $class_name . '.php';
}

$config = dirname(__FILE__) . '/config.php';

App::create($config);
