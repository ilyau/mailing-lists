<?php

require dirname(__FILE__) . '/app/init.php';

$worker = new Worker();
$worker->run();