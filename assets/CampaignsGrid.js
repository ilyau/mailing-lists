Ext.ns('App', 'App.campaigns');

/**
 * App.campaigns.Grid
 */
App.campaigns.Grid = Ext.extend(Ext.grid.EditorGridPanel, {
    iconCls: 'silk-grid',
    frame: true,
    title: 'Campaigns',
    height: 300,
    width: 700,
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
                scope: this,
            }, '-', {
                text: 'Status',
                iconCls: 'silk-information',
                handler: this.onStatus,
                scope: this,
            }, '-', {
                text: 'Refresh campaigns',
                iconCls: 'silk-table-refresh',
                handler: this.onRefresh,
                scope: this,
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
    getSelectionRowId: function() {

        var index = this.getSelectionModel().getSelectedCell();

        if (!index) {
            return false;
        }

        var rec = this.store.getAt(index[0]);

        return rec.id;
    },
    /**
     * onGo
     */
    onGo: function(btn, ev) {

        var _this = this;
        var id = _this.getSelectionRowId();

        if (!id) {
            return false;
        }

        Ext.MessageBox.confirm('Confirm', 'Вы уверены, что хотите начать рассылку?', function(btn) {

            if (btn == "yes") {

                Ext.Ajax.request({
                    url: '/ajax.php?type=Worker&act=run',
                    success: function(m) {

                        m = Ext.decode(m.responseText);

                        App.setAlert(App.STATUS_NOTICE, m.message);
                        _this.store.reload();
                    },
                    params: {id: id}
                });
            }

        });

    },
    /**
     * store status window
     */
    statusWin: false,
    /**
     * onStatus
     */
    onStatus: function(btn, ev) {

        var _this = this; // App.campaigns.Grid
        var intervalUpdate;
        var id = _this.getSelectionRowId();

        if (!id) {
            return false;
        }

        var progressBar = new Ext.ProgressBar({
            text: 'Status loading...',
        });

        var intervalCallback = function() {

            Ext.Ajax.request({
                url: '/ajax.php?type=Campaigns&act=status',
                success: function(m) {

                    var obj = Ext.decode(m.responseText);

                    var progress = parseFloat(obj[0]) / parseFloat(obj[1]);

                    progressBar.updateProgress(progress, obj[0] + "/" + obj[1]);

                    if (obj[0] == obj[1])
                        clearInterval(intervalUpdate);

                    if (obj[0] == obj[1] && parseInt(obj[0]) == 0)
                        _this.statusWin.update('<p>Campaign not running</p>');

                    if (obj[0] == obj[1] && parseInt(obj[0]) != 0)
                        _this.statusWin.update('<p>Campaign completed</p>');

                },
                params: {id: id}
            });

        }

        if (!_this.statusWin) {
            _this.statusWin = new Ext.Window({
                title: "Статус кампании",
                width: 300,
                height: 120,
                bodyStyle: 'margin-top: 20px',
                closeAction: 'hide',
                plain: true,
                buttons: [{
                        text: 'Close',
                        handler: function() {
                            _this.statusWin.hide();
                        }
                    }],
                items: progressBar,
                listeners: {
                    'beforeshow': function() {
                        intervalUpdate = setInterval(intervalCallback, 2000);
                        intervalCallback();
                    },
                    'hide': function() {
                        clearInterval(intervalUpdate);
                    }
                }
            });
        }
        this.statusWin.show(this);
    },
    onRefresh: function() {
        this.store.reload();
    }
});



var Campaigns = {};

// Create HttpProxy instance.  Notice new configuration parameter "api" here instead of load.  However, you can still use
// the "url" paramater -- All CRUD requests will be directed to your single url instead.
Campaigns.proxy = new Ext.data.HttpProxy({
    api: {
        read: 'ajax.php?type=Campaigns&act=read',
        create: 'ajax.php?type=Campaigns&act=create',
        update: 'ajax.php?type=Campaigns&act=update',
        destroy: 'ajax.php?type=Campaigns&act=destroy'
    }
});

// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
Campaigns.reader = new Ext.data.JsonReader({
    totalProperty: 'total',
    successProperty: 'success',
    idProperty: 'id',
    root: 'data',
    messageProperty: 'message'  // <-- New "messageProperty" meta-data
}, [
    {name: 'id'},
    {name: 'name', allowBlank: false},
    {name: 'description', allowBlank: false},
    {name: 'id_list', allowBlank: false},
    {name: 'id_template', allowBlank: false},
    {name: 'status'}
]);

// The new DataWriter component.
Campaigns.writer = new Ext.data.JsonWriter({
    encode: true,
    writeAllFields: true
});

// Typical Store collecting the Proxy, Reader and Writer together.
Campaigns.store = new Ext.data.Store({
    id: 'campaign',
    proxy: Campaigns.proxy,
    reader: Campaigns.reader,
    writer: Campaigns.writer, // <-- plug a DataWriter into the store just as you would a Reader
    autoSave: true // <-- false would delay executing create, update, destroy requests until specifically told to do so with some [save] buton.
});

// load the store immeditately
Campaigns.store.load();

// A new generic text field
Campaigns.textField = new Ext.form.TextField();


Ext.util.Format.comboRenderer = function(combo) {
    return function(value) {
        var record = combo.findRecord(combo.valueField, value);
        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
    }
}

Campaigns.comboList = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    store: Lists.store,
    lazyRender: true,
    mode: 'remote',
    valueField: 'id',
    displayField: 'name'
});

Campaigns.comboTemplate = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    store: Templates.store,
    lazyRender: true,
    mode: 'remote',
    valueField: 'id',
    displayField: 'title'
});

// Let's pretend we rendered our grid-columns with meta-data from our ORM framework.
Campaigns.campaignColumns = [
    {header: "ID", width: 20, sortable: true, dataIndex: 'id'},
    {header: "Name", width: 50, sortable: true, dataIndex: 'name', editor: Campaigns.textField},
    {header: "Description", width: 100, sortable: true, dataIndex: 'description', editor: Campaigns.textField},
    {header: "List", width: 80, sortable: true, dataIndex: 'id_list',
        editor: Campaigns.comboList, renderer: Ext.util.Format.comboRenderer(Campaigns.comboList)

    },
    {header: "Template", width: 80, sortable: true, dataIndex: 'id_template',
        editor: Campaigns.comboTemplate, renderer: Ext.util.Format.comboRenderer(Campaigns.comboTemplate)
    },
    {header: "Status", width: 40, sortable: true, dataIndex: 'status'},
];
