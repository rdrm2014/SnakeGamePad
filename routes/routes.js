/**
 * Created by ricardomendes on 14/05/15.
 */
var config = require('../package.json');
/*
 * GET home page.
 */
exports.index = function(req, res){
    res.render('index', { config: config });
};

/*
 * GET about page.
 */
exports.about = function(req, res){
    res.render('about', { config: config });
};