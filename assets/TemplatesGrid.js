
Ext.ns('App', 'App.templates');
/**
 * App.campaigns.Grid
 * A typical EditorGridPanel extension.
 */
App.templates.Grid = Ext.extend(Ext.grid.EditorGridPanel, {
    //renderTo: 'campaigns-grid',
    iconCls: 'silk-grid',
    frame: true,
    title: 'Templates',
    height: 300,
    width: 700,
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
        //this.bbar = this.buildBottomToolbar();
        //this.buttons = this.buildUI();

        // super
        App.templates.Grid.superclass.initComponent.call(this);
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
            }, '-'/*, {
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
             }, '-'*/];
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



var Templates = {};

// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
// the "url" paramater -- All CRUD requests will be directed to your single url instead.
Templates.proxy = new Ext.data.HttpProxy({
    api: {
        read: 'ajax.php?type=Templates&act=read',
        create: 'ajax.php?type=Templates&act=create',
        update: 'ajax.php?type=Templates&act=update',
        destroy: 'ajax.php?type=Templates&act=destroy'
    }
});

// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
Templates.reader = new Ext.data.JsonReader({
    totalProperty: 'total',
    successProperty: 'success',
    idProperty: 'id',
    root: 'data',
    messageProperty: 'message'  // <-- New "messageProperty" meta-data
}, [
    {name: 'id'},
    {name: 'title', allowBlank: false},
    {name: 'template', allowBlank: false},
]);

// The new DataWriter component.
Templates.writer = new Ext.data.JsonWriter({
    encode: true,
    writeAllFields: true
});

// Typical Store collecting the Proxy, Reader and Writer together.
Templates.store = new Ext.data.Store({
    id: 'template',
    proxy: Templates.proxy,
    reader: Templates.reader,
    writer: Templates.writer, // <-- plug a DataWriter into the store just as you would a Reader
    autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
});

// load the store immeditately
Templates.store.load();

// A new generic text field
Templates.textField = new Ext.form.TextField();

// Let's pretend we rendered our grid-columns with meta-data from our ORM framework.
Templates.campaignColumns = [
    {header: "ID", width: 10, sortable: true, dataIndex: 'id'},
    {header: "Titlte", width: 60, sortable: true, dataIndex: 'title', editor: Templates.textField},
    {header: "Template", width: 100, sortable: true, dataIndex: 'template', editor: Templates.textField},
];
