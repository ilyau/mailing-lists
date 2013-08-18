<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Управление рассылками</title>
		<link rel="stylesheet" href="/ext-3.4.1/resources/css/ext-all.css">
		<script type="text/javascript" src="/ext-3.4.1/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="/ext-3.4.1/ext-all-debug.js"></script>

		<script type="text/javascript" src="/assets/App.js"></script>
		<script type="text/javascript" src="/assets/writer.js"></script>
		<script type="text/javascript" src="/assets/ListsGrid.js"></script>
		<script type="text/javascript" src="/assets/TemplatesGrid.js"></script>
		<script type="text/javascript" src="/assets/CampaignsGrid.js"></script>
		<script type="text/javascript" src="/assets/SubscribersGrid.js"></script>

		<!-- Common Styles for the examples -->
		<link rel="stylesheet" type="text/css" href="/ext-3.4.1/examples/shared/examples.css" />
		<link rel="stylesheet" type="text/css" href="/resources/icons/silk.css" />
	</head>
	<body>
		
		<h1>Управление рассылками</h1>
		<p>Основные принципы сервиса. Есть кампании, списки подписчиков, подписчики и шаблоны писем. В клиентской части реализованы CRUD-операции. Во вкладке Campaigns можно запустить кампанию. Для этого нужно выделить любую ячейку кампании, которую надо запустить и нажать кнопку Go в top toolbar. После подтверждения статус компании изменится на running.</p>

		<p>Отправка писем происходит в фоновом многопоточном режиме с помощью Gearman. Вместо отправки письма, письмо логируется в файл /app/log.txt. Этот файл во время записи блокируется, учитывая параллельность выполняемых задач. На production запись в лог можно дополнить реальной отправкой письма с помощью mail().</p>

		<p>При выборе кампании и нажатии кнопки Status. Появится окно с Progress Bar, отображающим ход кампании. Данные обновляются два раза в секунду.</p>
		
		<div id="tabs"></div>
		
	</body>
</html>