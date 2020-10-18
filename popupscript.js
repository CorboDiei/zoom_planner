const postURL = 'http://localhost:3001/getcal';
const submit = $('#login-button');

submit.mousedown(submitF);


const submitF = () => {
    data = {
        username: $('#username').value,
        password: $('#password').value
    }
    $.post(postURL, data, res => {
        if (res.statusCode === 500) {
            
        } else {

        }
    })

}
