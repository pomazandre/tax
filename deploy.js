var FtpDeploy = require('ftp-deploy'),
    ftpDeploy = new FtpDeploy(),
    config = {
        username: "sapod_l_test",
        password: "dfgt5gfd", // optional, prompted if none given
        host: "ftp.gbas.gomel.rw",
        port: 0,
        localRoot: __dirname + "/dist",
        remoteRoot: "/html",
    }

ftpDeploy.deploy(config, function (err) {
    console.log('Deploy starting.');
    if (err) console.log(err)
    else console.log('Deploy is finished.');
});
