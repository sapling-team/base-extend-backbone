var BaseView = require('./instance/baseView');
var BaseModel = require('./instance/baseModel');
var BaseRouter = require('./instance/baseRouter');
var ManagedObject = require('./entity/ManagedObject');
var storage = require('./store/storage');
module.exports = {
    'View':BaseView,
    'Model':BaseModel,
    'Router':BaseRouter,
    'ManagedObject':ManagedObject,
    'storage':storage
};
