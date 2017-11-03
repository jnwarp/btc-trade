$(document).ready(function() {
    $('#logoutButton').click(function(e) {
        e.preventDefault();
        sendLogout();
    });
});

function sendLogout() {
    // send logout request
    $.post('/user/logout', {}, function(response) {
        var response = jQuery.parseJSON(response);

        if (response.success) {
            $.notify({
                title: '<b>Success</b>',
            	message: 'You have now been logged out successfully!'
            },{
            	type: 'success',
                newest_on_top: true,
                placement: {
            		from: "top",
            		align: "center"
            	}
            });
            setTimeout(function() {
                window.location.reload(true);
            }, 1500);
        } else {
            $.notify({
                title: '<b>Logout Failed</b>',
                message: 'There was a problem logging you out, please reload the page'
            },{
                type: 'warning',
                newest_on_top: true,
                placement: {
                    from: "top",
                    align: "center"
                }
            });
        }
    });
}
