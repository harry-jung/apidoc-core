var trim = require('../utils/trim');

function parse(content) {
    content = trim(content);

    // Search: type, url and title
    // Example: {get} /user/:id Get User by ID.
    var parseRegExp = /^(?:(?:\{(.+?)\})?\s*)?(?:\{+(.+?))(?:\}+(.+?))?$/g;
    var matches = parseRegExp.exec(content);

    if (!matches)
        return null;

    if (matches[1] === 'method') {
        parseRegExp = /^(?:(?:\{(.+?)\})?\s*)?(?:\{+(.+?))(?:\)\}+(.+?))?$/g;
        matches = parseRegExp.exec(content);
        return {    
            type : matches[1],
            url  : matches[2] + ')',
            title: matches[3] || ''
        }
    } else {
        return {
            type : matches[1],
            url  : matches[2],
            title: matches[3] || ''
        };
    }
}

/**
 * Exports
 */
module.exports = {
    parse : parse,
    path  : 'local',
    method: 'insert'
};
