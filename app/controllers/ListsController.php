<?php

class ListsController extends CrudController
{

    public function readAction()
    {
        $list = new ListModel();
        $result = $list->read();

        echo json_encode($result);
    }

    public function createAction()
    {
        $response = new Response();

        $data = json_decode($_REQUEST['data'], true);

        $list = new ListModel();
        $result = $list->create($data);

        if ($result) {
            $response->success = true;
            $response->message = "Created record";
            $response->data = array_merge(array('id' => App::get()->db()->lastInsertId()), $data);
        } else {
            $response->success = false;
        }

        echo $response->to_json();
    }

    public function destroyAction()
    {
        $response = new Response();

        $data = json_decode($_REQUEST['data'], true);

        $list = new ListModel();
        $result = $list->destroy((int) $data);

        if ($result) {
            $response->success = true;
            $response->message = "Removed campaign";
        } else {
            $response->success = false;
        }

        echo $response->to_json();
    }

    public function updateAction()
    {
        $response = new Response();

        $data = json_decode($_REQUEST['data'], true);
        $id = $data['id'];

        $list = new ListModel();
        $result = $list->update($id, $data);

        if ($result) {
            $response->success = true;
            $response->message = "Updated record";
            $response->data = $data;
        }

        echo $response->to_json();
    }

}
