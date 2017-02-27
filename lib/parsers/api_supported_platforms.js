var trim     = require('../utils/trim');
var unindent = require('../utils/unindent');

function parse(content) {
    var supportedPlatforms = trim(content);

    if (supportedPlatforms.length === 0)
        return null;

    return {
        supportedPlatforms: supportedPlatforms.split(',').map(function(str){
            return trim(str);
        })
    };
}

/**
 * Exports
 */
module.exports = {
    parse         : parse,
    path          : 'local',
    method        : 'insert',
    extendRoot    : true
};
