function signup() {
  var username = $('#inputUsername').val();
  var password = $('#inputPassword').val();
  var email = $('inputEmail').val();

  var user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  user.signUp().then(function (loginedUser) {
    var avnote = AV.Object.extend('note');
    var note = new avnote();
    note.set('owner', AV.User.current());
    note.set('notecontent','');
    note.save().then(function (todo) {
        alert("Now let us back to Scris Task and press the log in button.");
        window.location.href = "../";
	  }, function (error) {
				alert(JSON.stringify(error));
	  });
  }, (function (error) {
  	alert(JSON.stringify(error));
  }));
};

$(function() {
  $(".form-signup").on('submit', function(e) {
    e.preventDefault();
    signup();
  });
});
