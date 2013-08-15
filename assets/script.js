function getGridCampaign() {
	
	var win = false;

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
				fieldLabel: 'Description',
				name: 'description'
			}
		],
		buttons: [{
				text: 'Save',
				handler: function() {

					var data = addCampaignForm.getForm().getValues()
					var Plant = gridCampaign.getStore().recordType;

					var p = new Plant({
						name: data['name'],
						description: data['description']
					});

					gridCampaign.stopEditing();
					storeCampaign.add(p);

					win.hide();

					return false;
				}
			}, {
				text: 'Cancel',
				handler: function() {
					win.hide();
				}
			}]
	});


	var proxy = new Ext.data.HttpProxy({
		type: 'rest',
		api: {
			read: 'ajax.php?act=read_campaigns',
			create: 'ajax.php?act=create_campaigns',
			destroy: 'ajax.php?act=remove_campaigns',
			save: 'ajax.php?act=update_campaigns'
		}
	});

	var readerCampaign = new Ext.data.JsonReader({
		root: 'data', // Элемент объекта, содержащий данные
		idIndex: 0,
		fields: [// Описание колонок, выводимых в Grid
			{name: 'name', allowBlank: false},
			{name: 'description'},
		]
	})

	var storeCampaign = new Ext.data.Store({
		id: 'storeCampaign',
		reader: readerCampaign,
		proxy: proxy,
		autoSave: true,
		writer: new Ext.data.JsonWriter({
			encode: true
		}),
		sortInfo: {field: 'name', direction: 'ASC'},
		listeners: {
			'save': function() {
				storeCampaign.reload();
				console.log('r')
			}
		}

	});

	

	var gridCampaign = new Ext.grid.GridPanel({
		store: storeCampaign, // хранилище. Важно! Required!\
		height: 350,
		width: 500,
		renderTo: "t1",
		cm: new Ext.grid.ColumnModel({// Модель колонок
			columns: [// Колонки
				{
					header: 'Name',
					dataIndex: 'name',
					width: 150
				},
				{
					header: 'Description',
					dataIndex: 'description',
					width: 300
				},
			],
			// Флаг что по умолчанию колонки Sortable. по умолчанию false
			defaultSortable: true
		}),
		tbar: [{
				text: 'Add Campaign',
				handler: function() {

					if (!win) {

						win = new Ext.Window({
							width: 400,
							height: 150,
							title: 'Add Campaign',
							layout: 'fit',
							bodyStyle: {
								padding: '5px',
								'background-color': '#FFFFFF'
							},
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
				handler: function() {
					gridCampaign.stopEditing();

					var s = gridCampaign.getSelectionModel().getSelections();

					for (var i = 0, r; r = s[i]; i++) {
						storeCampaign.remove(r);
					}
					
				}
			}],
		listeners: {
			rowdblclick: function(grid, rowIndex, e) {
				console.log(grid.getStore())
			}
		}
	});
	
	storeCampaign.load();
	
	return gridCampaign;
}


Ext.onReady(function() {

	var tabs = new Ext.TabPanel({
		renderTo: 'tabs1',
		activeTab: 0,
		bodyStyle: 'padding:10px;',
		defaults: {autoHeight: true},
		items: [
			{title: 'Campaigns', contentEl:'t1'},
			{title: 'Lists'},
			{title: 'Subscribers'},
			{title: 'Templates'}
		]
	});

}); //end onReady