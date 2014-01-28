<?php

class App
{

    const TPLPATH = '/template/';

    private $_db;
    private $_log;
    private static $config;
    private static $app;

    public function db()
    {

        if ($this->_db == NULL) {
            $this->_db = new PDO(self::$config['db']['type'] . ':host=' . self::$config['db']['host'] . ';dbname=' . self::$config['db']['database'], self::$config['db']['user'], self::$config['db']['password']);

            $this->_db->query("SET CHARACTER SET utf8");
        }

        return $this->_db;
    }

    private function __construct()
    {

    }

    private function __clone()
    {

    }

    private function __wakeup()
    {

    }

    public static function create($config)
    {
        if (!self::$app) {
            $class = __CLASS__;
            self::$app = new $class();
            self::$config = include $config;
        }

        return self::$app;
    }

    public static function get()
    {
        return self::$app;
    }

    public function log($str)
    {
        $str_to_log = date('d.m.y H:i:s') . " - " . $str . "\n";

        if ($this->_log == NULL) {
            $this->_log = dirname(__FILE__) . "/log.txt";
            file_put_contents($this->_log, $str_to_log, LOCK_EX);
        } else {
            file_put_contents($this->_log, $str_to_log, FILE_APPEND | LOCK_EX);
        }
    }

    public function view()
    {
        echo $this->template('main.php');
    }

    /**
     * Шаблонизатор
     *
     * @param $template - путь до файла шаблона
     * @param $v - ассоциативный массив значений переданных в шаблон
     * @return - результат работы шаблона
     * @example _tpl_('blog/root.php', array('title'=>'Hi!'))
     */
    public function template($template, $v = array())
    {
        extract($v, EXTR_SKIP);
        ob_start();
        include($_SERVER['DOCUMENT_ROOT'] . self::TPLPATH . $template);
        return ob_get_clean();
    }

}
