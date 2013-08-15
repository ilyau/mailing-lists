/*
 This file is part of Ext JS 3.4
 
 Copyright (c) 2011-2013 Sencha Inc
 
 Contact:  http://www.sencha.com/contact
 
 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.
 
 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.
 
 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://www.sencha.com/contact.
 
 Build date: 2013-04-03 15:07:25
 */
// Application instance for showing user-feedback messages.
var App = new Ext.App({});

// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
// the "url" paramater -- All CRUD requests will be directed to your single url instead.
var proxy = new Ext.data.HttpProxy({
	api: {
		read: 'ajax.php?act=read_campaigns',
		create: 'ajax.php?act=create_campaigns',
		update: 'ajax.php?act=update_campaigns',
		destroy: 'ajax.php?act=destroy_campaigns'
	}
});

// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
var reader = new Ext.data.JsonReader({
	totalProperty: 'total',
	successProperty: 'success',
	idProperty: 'id',
	root: 'data',
	messageProperty: 'message'  // <-- New "messageProperty" meta-data
}, [
	{name: 'id'},
	{name: 'name', allowBlank: false},
	{name: 'description', allowBlank: false},
]);

// The new DataWriter component.
var writer = new Ext.data.JsonWriter({
	encode: true,
	writeAllFields: true
});

// Typical Store collecting the Proxy, Reader and Writer together.
var store = new Ext.data.Store({
	id: 'campaign',
	proxy: proxy,
	reader: reader,
	writer: writer, // <-- plug a DataWriter into the store just as you would a Reader
	autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
});

// load the store immeditately
store.load();

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

// A new generic text field
var textField = new Ext.form.TextField();

// Let's pretend we rendered our grid-columns with meta-data from our ORM framework.
var campaignColumns = [
	{header: "ID", width: 10, sortable: true, dataIndex: 'id'},
	{header: "Name", width: 100, sortable: true, dataIndex: 'name', editor: textField},
	{header: "Description", width: 50, sortable: true, dataIndex: 'description', editor: textField},
];

Ext.onReady(function() {


	Ext.QuickTips.init();

	// create user.Grid instance (@see UserGrid.js)
	var campaignsGrid = new App.campaigns.Grid({
		renderTo: 'campaigns-grid',
		store: store,
		columns: campaignColumns
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

	var tabs = new Ext.TabPanel({
		renderTo: 'tabs',
		activeTab: 0,
		width: 500,
		//bodyStyle: 'padding:10px;',
		defaults: {autoHeight: true},
		items: [
			{title: 'Campaigns', contentEl: 'campaigns'},
			{title: 'Lists', contentEl: 'lists'},
			{title: 'Subscribers', contentEl: 'subscribers'},
			{title: 'Templates', contentEl: 'templates'}
		]
	});
});
