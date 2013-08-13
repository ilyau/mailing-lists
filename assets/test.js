// Наш основной объект окна
WINDOW = {
	// Базовые параметры, чтобы не копипастить их постоянно
	getParams: function() {
		return {
			width: 500,
			height: 400,
			title: 'Окошечко',
			layout: 'fit',
			bodyStyle: {
				padding: '5px',
				'background-color': '#FFFFFF'
			},
			listeners: {// Прослушиватели на события
				close: function() {               // На закрытие окна 
					WINDOW.win = false;
				}
			},
			modal: true
		}
	},
	// Выводим окно
	show: function(params) {
		if (!this.win) {
			this.win = new Ext.Window(params ? params : this.getParams());
		}
		this.win.show();
	},
	// Расширяем имеющиеся параметры 
	extend: function(obj, addsParams) {
		// Каждый элемент добавляемого объекта прибавляем к имеющемуся 
		for (var i in addsParams) {
			obj[i] = addsParams[i];
		}
		return obj;
	},
	click_: function(text) {
		alert('Нажали кнопку ' + text);
	},
	// Тулбар
	toolbar: {
		items: [{
				text: 'Добавить',
				icon: 'images/icons/fam/add.png',
				handler: function() {
					WINDOW.click_('Добавить');
				}
			}, {
				text: 'Удалить',
				icon: 'images/icons/fam/delete.gif',
				handler: function() {
					WINDOW.click_('Удалить');
				}
			}]
	},
	// Получаем окно с туллбаром
	showToolbar: function() {
		params = this.extend(this.getParams(), {
			tbar: this.toolbar
		})
		this.show(params);
	}
}