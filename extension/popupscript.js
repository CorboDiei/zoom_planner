const postURL = 'http://localhost:3001/getcal';
const submit = $("#login-button");
const error = $("#error-div");
const download = $("#download-div");
const form = $("#form-div");


function submitF() {
    $('#error-div').removeClass("show").addClass("invis");
    $("#login-form").removeClass("show").addClass("invis");
    data = {
        username: $('#username').val(),
        password: $('#password').val()
    }
    $.post(postURL, data, async res => {
        console.log(res);
        if (res.link == null) {
            $("#error-div").removeClass('invis').addClass("show");
            $("#form-div").removeClass('invis').addClass("show");
        } else {
            $("#download-div").removeClass('invis').addClass("show");
            $("#download-div").append('<a href="' + res.link + '">Download</a>');
        }
    })

}

submit.mousedown(submitF);