
// Application instance for showing user-feedback messages.
var App = new Ext.App({});

////
// ***New*** centralized listening of DataProxy events "beforewrite", "write" and "writeexception"
// upon Ext.data.DataProxy class.  This is handy for centralizing user-feedback messaging into one place rather than
// attaching listenrs to EACH Store.
//
// Listen to all DataProxy beforewrite events
//
Ext.data.DataProxy.addListener('beforewrite', function(proxy, action) {
	App.setAlert(App.STATUS_NOTICE, "Before " + action);
});

////
// all write events
//
Ext.data.DataProxy.addListener('write', function(proxy, action, result, res, rs) {
	App.setAlert(true, action + ':' + res.message);
});

////
// all exception events
//
Ext.data.DataProxy.addListener('exception', function(proxy, type, action, options, res) {
	if (type === 'remote') {
		Ext.Msg.show({
			title: 'REMOTE EXCEPTION',
			msg: res.message,
			icon: Ext.MessageBox.ERROR,
			buttons: Ext.Msg.OK
		});
	}
});


Ext.onReady(function() {


	Ext.QuickTips.init();

	// create user.Grid instance (@see UserGrid.js)
	var campaignsGrid = new App.campaigns.Grid({
		store: Campaigns.store,
		columns: Campaigns.campaignColumns
				/*listeners: {
				 rowclick: function(g, index, ev) {
				 var rec = g.store.getAt(index);
				 userForm.loadRecord(rec);
				 },
				 destroy: function() {
				 userForm.getForm().reset();
				 }
				 }*/
	});

	var listsGrid = new App.lists.Grid({
		store: Lists.store,
		columns: Lists.campaignColumns

	});

	var subscribersGrid = new App.subscribers.Grid({
		store: Subscribers.store,
		columns: Subscribers.campaignColumns
	})

	var templatesGrid = new App.templates.Grid({
		store: Templates.store,
		columns: Templates.campaignColumns
	})


	new Ext.TabPanel({
		renderTo: 'tabs',
		activeTab: 0,
		width: 700,
		//bodyStyle: 'padding:10px;',
		defaults: {autoHeight: true},
		items: [
			{
				title: 'Campaigns',
				items: [
					campaignsGrid
				],
				listeners: {
					activate: function() {
						Campaigns.store.reload();
					}
				}
			},
			{
				title: 'Lists',
				items: [
					listsGrid
				],
				listeners: {
					activate: function() {
						Lists.store.reload();
					}
				}
			},
			{
				title: 'Subscribers',
				items: [
					subscribersGrid
				],
				listeners: {
					activate: function() {
						Subscribers.store.reload();
					}
				}
			},
			{
				title: 'Templates',
				items: [
					templatesGrid
				],
				listeners: {
					activate: function() {
						Templates.store.reload();
					}
				}
			}
		]
	});
});
