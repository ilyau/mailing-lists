<?php

/**
 * Description of App
 *
 * @author user
 */
class App {

	private $db;
	private $config;
	
	public function db() {

		if($this->db == NULL) {
			$this->db = new PDO("{$this->config['db']['type']}:host={$this->config['db']['host']};dbname={$this->config['db']['database']}"
							,$this->config['db']['user']
							,$this->config['db']['password']);

			$this->db->query("SET CHARACTER SET utf8");
		}		

		return $this->db;
	}

	public function __construct($config) {

		$this->config = include $config;
		
		
	}

	const TPLPATH = '/template/';

	public function view() {

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
	public function template($template, $v = array()) {
		extract($v, EXTR_SKIP);
		ob_start();
		include($_SERVER['DOCUMENT_ROOT'] . self::TPLPATH . $template);
		return ob_get_clean();
	}

}
