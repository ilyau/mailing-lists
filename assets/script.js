function getGrid(dataCampaign) {

	var win;

	var addCampaignForm = new Ext.FormPanel({
		labelWidth: 75, // label settings here cascade unless overridden
		bodyStyle: 'padding:5px 5px 0',
		width: 350,
		defaults: {width: 230},
		defaultType: 'textfield',
		items: [{
				fieldLabel: 'Name',
				name: 'name',
				allowBlank: false
			}, {
				fieldLabel: 'Name',
				name: 'Description'
			}
		],
		buttons: [{
				text: 'Save',
				handler: function() {

					storeCampaign.add(new storeCampaign.recordType({
						name: 'data3',
						description: 'data4'
					}));




				}
			}, {
				text: 'Cancel'
			}]
	});

	var readerCampaign = new Ext.data.JsonReader({
		root: 'data', // Элемент объекта, содержащий данные
		idProperty: 'id', // Коланка, содержащая Уникальные данные ID
		fields: [// Описание колонок, выводимых в Grid
			{name: 'id', type: 'int', allowBlank: false},
			{name: 'name', allowBlank: false},
			{name: 'description'},
		]
	});

	var storeCampaign = new Ext.data.Store({
		id: 'storeCampaign',
		reader: readerCampaign,
		// Получаем входные данные для работы
		data: dataCampaign
	});

	var gridCampaign = new Ext.grid.GridPanel({
		store: storeCampaign, // хранилище. Важно! Required!\
		height: 350,
		width: 500,
		cm: new Ext.grid.ColumnModel({// Модель колонок
			columns: [// Колонки
				{
					header: 'Name',
					dataIndex: 'name',
					width: 150,
					/*editor: new fm.TextField({
					 allowBlank: false
					 })*/
				},
				{
					header: 'Description',
					dataIndex: 'description',
					width: 300,
					/*editor: new fm.TextField({
					 allowBlank: false
					 })*/
				},
			],
			// Флаг что по умолчанию колонки Sortable. по умолчанию false
			defaultSortable: true
		}),
		tbar: [{
				text: 'Add Campaign',
				handler: function() {


					// access the Record constructor through the grid's store
					/*var Plant = gridCampaign.getStore().recordType;
					 var p = new Plant({
					 name: '',
					 description: ''
					 });
					 gridCampaign.stopEditing();
					 storeCampaign.insert(0, p);
					 gridCampaign.startEditing(0, 0);*/

					if (!win) {

						win = new Ext.Window({
							width: 400,
							height: 300,
							title: 'Add Campaign',
							//						layout: 'fit',
							//						bodyStyle: {
							//							padding: '5px',
							//							'background-color': '#FFFFFF'
							//						},
							listeners: {// Прослушиватели на события
								close: function() {               // На закрытие окна 
									//WINDOW.win = false;
								}
							},
							modal: true,
							items: [
								addCampaignForm
							]
						});
					}

					win.show();



				}
			},
			{
				text: 'Remove Campaign',
				//disabled: true,
				handler: function() {
					gridCampaign.stopEditing();
					var s = gridCampaign.getSelectionModel().getSelections();
					for (var i = 0, r; r = s[i]; i++) {
						storeCampaign.remove(r);
					}
				}
			}]
	});

	return gridCampaign;
}


Ext.onReady(function() {

	var dataCampaign;

	Ext.Ajax.request({
		url: '/ajax.php?act=read_campaigns',
		success: function(response) {
			dataCampaign = Ext.util.JSON.decode(response.responseText);


			var tabs = new Ext.TabPanel({
				renderTo: Ext.getBody(),
				activeTab: 0,
				bodyStyle: 'padding:10px;',
				defaults: {autoHeight: true},
				items: [
					{title: 'Campaigns', items: [
							getGrid(dataCampaign)
						]},
					{title: 'Lists'},
					{title: 'Subscribers'},
					{title: 'Templates'}
				]
			});
		}
	});





}); //end onReady