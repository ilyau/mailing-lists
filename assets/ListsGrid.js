
Ext.ns('App', 'App.lists');
/**
 * App.campaigns.Grid
 * A typical EditorGridPanel extension.
 */
App.lists.Grid = Ext.extend(Ext.grid.EditorGridPanel, {
    //renderTo: 'lists-grid',
    iconCls: 'silk-grid',
    frame: true,
    title: 'Lists',
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

        // super
        App.lists.Grid.superclass.initComponent.call(this);
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



var Lists = {};

// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
// the "url" paramater -- All CRUD requests will be directed to your single url instead.
Lists.proxy = new Ext.data.HttpProxy({
    api: {
        read: 'ajax.php?type=Lists&act=read',
        create: 'ajax.php?type=Lists&act=create',
        update: 'ajax.php?type=Lists&act=update',
        destroy: 'ajax.php?type=Lists&act=destroy'
    }
});

// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
Lists.reader = new Ext.data.JsonReader({
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
Lists.writer = new Ext.data.JsonWriter({
    encode: true,
    writeAllFields: true
});

// Typical Store collecting the Proxy, Reader and Writer together.
Lists.store = new Ext.data.Store({
    id: 'campaign',
    proxy: Lists.proxy,
    reader: Lists.reader,
    writer: Lists.writer, // <-- plug a DataWriter into the store just as you would a Reader
    autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
});

// load the store immeditately
Lists.store.load();

// A new generic text field
Lists.textField = new Ext.form.TextField();

// Let's pretend we rendered our grid-columns with meta-data from our ORM framework.
Lists.campaignColumns = [
    {header: "ID", width: 10, sortable: true, dataIndex: 'id'},
    {header: "Name", width: 50, sortable: true, dataIndex: 'name', editor: Lists.textField},
    {header: "Description", width: 100, sortable: true, dataIndex: 'description', editor: Lists.textField},
];
