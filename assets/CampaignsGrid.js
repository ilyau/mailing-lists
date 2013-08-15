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
Ext.ns('App', 'App.campaigns');
/**
 * App.campaigns.Grid
 * A typical EditorGridPanel extension.
 */
App.campaigns.Grid = Ext.extend(Ext.grid.EditorGridPanel, {
	renderTo: 'campaigns-grid',
	iconCls: 'silk-grid',
	frame: true,
	//title: 'Campaigns',
	height: 300,
	width: 500,
	//style: 'margin-top: 10px',
	autoSave: true,
	initComponent: function() {

		// typical viewConfig
		this.viewConfig = {
			forceFit: true
		};

		// relay the Store's CRUD events into this grid so these events can be conveniently listened-to in our application-code.
		this.relayEvents(this.store, ['destroy', 'save', 'update']);

		// build toolbars and buttons.
		this.tbar = this.buildTopToolbar();
		//	this.bbar = this.buildBottomToolbar();
		this.buttons = this.buildUI();

		// super
		App.campaigns.Grid.superclass.initComponent.call(this);
	},
	/**
	 * buildTopToolbar
	 */
	buildTopToolbar: function() {
		return [{
				text: 'Add',
				iconCls: 'silk-add',
				handler: this.onAdd,
				scope: this
			}, '-', {
				text: 'Delete',
				iconCls: 'silk-delete',
				handler: this.onDelete,
				scope: this
			}, '-', {
				text: 'Go',
				iconCls: 'silk-application-go',
				handler: this.onGo,
				scope: this
			}, '-', {
				text: 'Status',
				iconCls: 'silk-information',
				handler: this.onStatus,
				scope: this
			}];
	},
	/**
	 * buildBottomToolbar
	 */
	buildBottomToolbar: function() {
		return ['<b>@cfg:</b>', '-', {
				text: 'autoSave',
				enableToggle: true,
				pressed: true,
				tooltip: 'When enabled, Store will execute Ajax requests as soon as a Record becomes dirty.',
				toggleHandler: function(btn, pressed) {
					this.store.autoSave = pressed;
				},
				scope: this
			}, '-', {
				text: 'batch',
				enableToggle: true,
				pressed: true,
				tooltip: 'When enabled, Store will batch all records for each type of CRUD verb into a single Ajax request.',
				toggleHandler: function(btn, pressed) {
					this.store.batch = pressed;
				},
				scope: this
			}, '-', {
				text: 'writeAllFields',
				enableToggle: true,
				tooltip: 'When enabled, Writer will write *all* fields to the server -- not just those that changed.',
				toggleHandler: function(btn, pressed) {
					store.writer.writeAllFields = pressed;
				},
				scope: this
			}, '-'];
	},
	/**
	 * buildUI
	 */
	buildUI: function() {
		return [{
				text: 'Save',
				iconCls: 'icon-save',
				handler: this.onSave,
				scope: this
			}];
	},
	/**
	 * onSave
	 */
	onSave: function(btn, ev) {
		this.store.save();
	},
	/**
	 * onAdd
	 */
	onAdd: function(btn, ev) {
		var u = new this.store.recordType({
			first: '',
			last: '',
			email: ''
		});
		this.stopEditing();
		this.store.insert(0, u);
		this.startEditing(0, 1);
	},
	/**
	 * onDelete
	 */
	onDelete: function(btn, ev) {
		var index = this.getSelectionModel().getSelectedCell();
		if (!index) {
			return false;
		}
		var rec = this.store.getAt(index[0]);
		this.store.remove(rec);
	},
	/**
	 * onGo
	 */
	onGo: function(btn, ev) {

	},
	/**
	 * onStatus
	 */
	onStatus: function(btn, ev) {
		
	}
});
