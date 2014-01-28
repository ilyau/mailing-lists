<?php

class CampaignModel extends Model
{

    protected $table_name = "campaign";
    protected $attributes = array('name', 'description', 'id_list', 'id_template', 'status'); // all attributes without id

    public function create(array $attributes)
    {
        $attributes['status'] = "new";

        return parent::create($attributes);
    }

    public function isCompleted($id)
    {
        $id = (int) $id;

        $cmd = App::get()->db()->query('SELECT COUNT(*) FROM task WHERE id_campaign=' . $id . ' AND status="done"');
        $done = $cmd->fetch();

        $cmd = App::get()->db()->query('SELECT COUNT(*) FROM task WHERE id_campaign=' . $id);
        $all = $cmd->fetch();

        $isCompleted = $done[0] == $all[0];

        if ($isCompleted) {
            App::get()->db()->exec('UPDATE campaign SET status="completed" WHERE id=' . $id);
        }

        return $isCompleted;
    }

    public function getStatus($id)
    {
        $id = (int) $id;

        $cmd = App::get()->db()->query('SELECT COUNT(*) FROM task WHERE id_campaign=' . $id . ' AND status="done"');
        $done = $cmd->fetch();

        $cmd = App::get()->db()->query('SELECT COUNT(*) FROM task WHERE id_campaign=' . $id);
        $all = $cmd->fetch();

        return array($done[0], $all[0]);
    }

}
