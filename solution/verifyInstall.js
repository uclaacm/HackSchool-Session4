const fs = require('fs');

fs.readFile('package.json', (err, data) => {
    if (err) {
        console.log("You need to create the package! Run: npm init and follow the instructions.");
        return;
    }

    Promise.resolve(JSON.parse(data)).then(json => {
        let error = false;
        const deps = ["body-parser", "hbs", "express"];
        const depList = json["dependencies"];
        if (!depList)
            console.log("You haven't installed any dependencies!");

        for (let dep of deps) {
            let found = false;
            for (let listDep in depList) {
                if (listDep === dep)
                    found = true;
            }
            if (!found) {
                console.log("You need to install '" + dep + "'. Run: 'npm install " + dep + " --save'");
                error = true;
            }
        }

        if (!error) {
            console.log("Everything is set up! Open up index.js and let's start writing the server.");
        }

    }).catch(err => {
        console.log("Something went wrong!");
        console.log(err);
    });
});