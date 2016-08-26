// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

var open = require('open');
var path = require('path');

var port = 5000;
var url = "http://localhost:" + port;

var express = require('express');
var app = express();

var static = express.static(path.join(__dirname, 'public'));
app.use(static);

app.get("/oidc-client.js", function(req, res){
    res.sendFile(path.join(__dirname, '/node_modules/oidc-client/dist/oidc-client.js'));
});

console.log("listening on " + url);
app.listen(port);
