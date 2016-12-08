<?php
require_once('orm/Highscore_orm.php');

$path_components = explode('/', $_SERVER['PATH_INFO']);

//GET Requests handler
if ($_SERVER['REQUEST_METHOD'] == "GET") {
  if ((count($path_components) >= 2) && ($path_components[1] != "")) {

    $highscore_id = intval($path_components[1]);

    //find object via ORM
    $highscore = Highscore::findByID($highscore_id);
    if ($highscore == null){
      header("HTTP/1.0 404 Not Found");
      print("Highscore id: " . $highscore_id . " not found.");
      exit();
    }

    //Check for deletion
    if (isset($_REQUEST['delete'])) {
      $highscore->delete();
      header("Content-type: application/json");
      print(json_encode(true));
      exit();
    }

    //Generate JSON encoding for response
    header("Content-type: application/json");
    print($highscore->getJSON());
    exit();
  }

  header("Content-type: application/json");
  print(json_encode(Highscore::getAllIDs()));
  exit();

}

else if ($_SERVER['REQUEST_METHOD'] == "POST") {
  // Either creating or updating

  // Following matches /todo.php/<id> form
  if ((count($path_componentsonents) >= 2) &&
      ($path_componentsonents[1] != "")) {

        //Interpret <id> as integer and look up via ORM
        $highscore_id = intval($path_componentsonents[1]);
        $highscore = Todo::findByID($highscore_id);

        if ($highscore == null) {
          // Highscore not found.
          header("HTTP/1.0 404 Not Found");
          print("Todo id: " . $highscore_id . " not found while attempting update.");
          exit();
        }

        // Validate values
        $new_user = false;
        if (isset($_REQUEST['user'])) {
          $new_user = trim($_REQUEST['user']);
          if ($new_user == "") {
    	       header("HTTP/1.0 400 Bad Request");
    	        print("Username Not Found");
    	         exit();
          }
        }

    }

    if (isset($_REQUEST['complete'])) {
      $new_complete = true;
    } else {
      $new_complete = false;
    }

    // Update User via ORM
    if ($new_user) {
      $highscore->setUser($new_user);
    }

    if (!$new_complete) {
      $highscore->clearComplete();
    } else {
      $highscore->setComplete();
    }

    // Return JSON encoding of updated Todo
    header("Content-type: application/json");
    print($highscore->getJSON());
    exit();
  } else {

    // Creating a new Todo item

    // Validate values
    if (!isset($_REQUEST['Username'])) {
      header("HTTP/1.0 400 Bad Request");
      print("Missing Username");
      exit();
    }



    if (isset($_REQUEST['complete'])) {
      $complete = true;
    } else {
      $complete = false;
    }


    // Create new Todo via ORM
    $new_highscore = Highscore::create($id, $user, $score, $complete);

    // Report if failed
    if ($new_highscore == null) {
      header("HTTP/1.0 500 Server Error");
      print("Server couldn't create new Highscore.");
      exit();
    }

    //Generate JSON encoding of new Todo
    header("Content-type: application/json");
    print($new_highscore->getJSON());
    exit();
  }
}

// If here, none of the above applied and URL could
// not be interpreted with respect to RESTful conventions.

header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");
}





 ?>
