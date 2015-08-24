var path = require('path');
var fs = require('fs');


var filePath = '/Users/quoccuong/PhpstormProjects/RealtimeApp/test';
var fileName = 'aaa.js';

var count  = 0;
var state = false;

var findFile = function (link) {
    count++;
    fs.readdir(link, function (err,allFiles) {
        allFiles.forEach(function (file) {
            var linkToFile = link +'/'+ file;
            fs.stat(linkToFile, function (err,stats) {
                if(stats.isDirectory()){
                    findFile(linkToFile)
                }
                if (stats.isFile()){
                    if (file === fileName) {
                        state = true
                    }
                }
                if(count === 0) {
                    if(state) {
                        console.log('ton tai file');
                    } else {
                        console.log('khong ton tai file');
                    }
                }
            })
        })
        count--;
    });
};

findFile(filePath);

