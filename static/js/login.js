function login(){
  event.preventDefault();

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    email: email,
    password: password
  }));
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
    } else { 
      alert("Error Invalid")
    }

    // end of state change: it can be after some time (async)
};
}
