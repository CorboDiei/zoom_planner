var data = {
    username: "dcorbo3",
    password: "fakepass"
}
const text = $('h2');

$.post('/getcal', data, res => {
    var addLink = '<a href="' + res.link + '">Download</a>';
    text.append(addLink);
})