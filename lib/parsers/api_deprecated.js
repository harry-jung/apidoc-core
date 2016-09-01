var semver = require('semver');

var trim = require('../utils/trim');

var ParameterError = require('../errors/parameter_error');

function parse(content) {
    content = trim(content);

    if (content.length === 0)
        return null;

    if ( ! semver.valid(content))
        throw new ParameterError('Deprecated format not valid.',
                                 'apiDeprecated', '@apiDeprecated major.minor.patch', '@apiDefine 1.2.3');

    return {
        deprecated: content
    };
}

/**
 * Exports
 */
module.exports = {
    parse     : parse,
    path      : 'local',
    method    : 'insert',
    extendRoot: true
};
