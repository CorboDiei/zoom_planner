const fs = require('fs');

function getUserData(fileName) {
    fs.readFile(fileName, function (err, data) {
        if (err) throw err;
        console.log(data.toString());
    });
}
getUserData("user_pXLxAiHUJK4Bgb3PF4oAzbyS4OtUs2PkVVu7cKWb (1).ics");
