/**
 * To run some global functions
 * 
 * @param {APP} app Express app;
 * @return {Void}  
 */

module.exports = (app) => {

    // =================== To convert new Error to JSON ================
    if (!('toJSON' in Error.prototype)) {
        Object.defineProperty(Error.prototype, 'toJSON', {
            value: function () {
                var alt = {};
    
                Object.getOwnPropertyNames(this).forEach(function (key) {
                    alt[key] = this[key];
                }, this);
    
                return alt;
            },
            configurable: true,
            writable: true
        });
    }

    global.stringify = function(j) {
        return this.JSON.stringify(j, null, 2);
    }
}