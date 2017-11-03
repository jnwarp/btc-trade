$(document).ready(function() {
    $('#loginButton').click(function(e) {
        e.preventDefault();
        sendLoginInfo();
    });

    $('#createAccountButton').click(function(e) {
        e.preventDefault();
        createAccount();
    });

    $('#loginPassword').keypress(function(e) {
        if (e.which == 13) {
            sendLoginInfo();
            return false;
        }
    });
});

function sendLoginInfo() {
    // do not send empty login information to server
    if ($('#loginEmail').val() == '' || $('#loginPassword').val() == '') {
        $.notify({
            title: '<b>Missing Field</b>',
            message: 'There are one or more inputs missing.'
        },{
            type: 'warning',
            newest_on_top: false,
            placement: {
                from: "top",
                align: "center"
            }
        });

        return false;
    }

    $.post('/user/login', {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        }, function(response) {
        var response = jQuery.parseJSON(response);

        if (response.success) {
            $.notify({
                title: '<b>Success</b>',
            	message: 'You have now been logged in successfully!'
            },{
            	type: 'success',
                newest_on_top: false,
                placement: {
            		from: "top",
            		align: "center"
            	}
            });
            setTimeout(function() {
                window.location.reload(true);
            }, 1500);
        } else {
            if (response.error == 'too_many_attempts') {
                $.notify({
                    title: '<b>Too Many Attempts</b>',
                	message: 'There have been too many failed login attempts from this IP address, please wait one hour and try again.'
                },{
                	type: 'danger',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else {
                $.notify({
                    title: '<b>Login Failed</b>',
                	message: 'You have entered incorrect login information, please try again.'
                },{
                	type: 'warning',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            }
        }
    });
}

function createAccount() {
    if ($('#loginButton').attr('disabled')) {
        return false;
    }

    // do not send empty login information to server
    if ($('#loginEmail').val() == '' || $('#loginPassword').val() == '') {
        $.notify({
            title: '<b>Missing Field</b>',
            message: 'There are one or more inputs missing.'
        },{
            type: 'warning',
            newest_on_top: false,
            placement: {
                from: "top",
                align: "center"
            }
        });

        return false;
    }

    $.post('/user/createAccount', {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        }, function(response) {
        var response = jQuery.parseJSON(response);

        if (response.success) {
            $.notify({
                title: '<b>Success</b>',
            	message: 'Your account has been created, you can now log in.'
            },{
            	type: 'success',
                newest_on_top: false,
                placement: {
            		from: "top",
            		align: "center"
            	}
            });
            $('#loginPassword').val('');
        } else {
            if (response.error == 'too_many_attempts') {
                $.notify({
                    title: '<b>Too Many Attempts</b>',
                	message: 'There have been too many failed login attempts from this IP address, please wait one hour and try again.'
                },{
                	type: 'danger',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            } else if (!response.valid_email) {
                    $.notify({
                        title: '<b>Invalid Email</b>',
                        message: 'The email you provided was invalid, do you already have an account?'
                    },{
                        type: 'warning',
                        newest_on_top: false,
                        placement: {
                            from: "top",
                            align: "center"
                        }
                    });
            } else if (!response.valid_password) {
                    $.notify({
                        title: '<b>Invalid Password</b>',
                        message: 'Your password must have at least 8 characters, numbers/symbols, and both upper/lowercase letters.'
                    },{
                        type: 'warning',
                        newest_on_top: false,
                        placement: {
                            from: "top",
                            align: "center"
                        }
                    });
            } else {
                $.notify({
                    title: '<b>Account Create Failed</b>',
                	message: 'There was a problem creating your account, please try again'
                },{
                	type: 'danger',
                    newest_on_top: false,
                    placement: {
                		from: "top",
                		align: "center"
                	}
                });
            }
        }
    });
}
