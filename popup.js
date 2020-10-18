// grabbing data from form
document.addEventListener('DOMContentLoaded', function () {
    const myForm = document.getElementById("login-form")
    myForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const formData = {
            username,
            password
        }
        alert(`${username}, ${password}`)
    });
}, false)