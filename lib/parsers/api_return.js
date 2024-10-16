var trim     = require('../utils/trim');
var unindent = require('../utils/unindent');

// var apiParser = require('./api_param_for_return.js');

// Search: group, type, optional, fieldname, defaultValue, size, description
// Example: {String{1..4}} [user.name='John Doe'] Users fullname.
//
// Naming convention:
//     b -> begin
//     e -> end
//     name -> the field value
//     oName -> wrapper for optional field
//     wName -> wrapper for field
var regExp = {
    b:               '^',                                   // start
    oGroup: {                                               // optional group: (404)
        b:               '\\s*(?:\\(\\s*',                  // starting with '(', optional surrounding spaces
        group:              '(.+?)',                        // 1
        e:               '\\s*\\)\\s*)?'                    // ending with ')', optional surrounding spaces
    },
    oType: {                                                // optional type: {string}
        b:               '\\s*(?:\\{\\s*',                  // starting with '{', optional surrounding spaces
        type:                '([a-zA-Z0-9\?\(\)#:\\.\\,\\<\\>\\/\\\\\\[\\]_-\s\*]+)', // 2
        oSize: {                                            // optional size within type: {string{1..4}}
            b:               '\\s*(?:\\{\\s*',              // starting with '{', optional surrounding spaces
            size:                '(.+?)',                   // 3
            e:               '\\s*\\}\\s*)?'                // ending with '}', optional surrounding spaces
        },
        oAllowedValues: {                                   // optional allowed values within type: {string='abc','def'}
            b:               '\\s*(?:=\\s*',                // starting with '=', optional surrounding spaces
            possibleValues:      '(.+?)',                   // 4
            e:               '(?=\\s*\\}\\s*))?'            // ending with '}', optional surrounding spaces
        },
        e:               '\\s*\\}\\s*)?'                    // ending with '}', optional surrounding spaces
    },
    description:         '(.*)?',                           // 5
    e:               '$|@'
};

function _objectValuesToString(obj) {
    var str = '';
    for (var el in obj) {
        if (typeof obj[el] === 'string')
            str += obj[el];
        else
            str += _objectValuesToString(obj[el]);
    }
    return str;
}

var parseRegExp = new RegExp(_objectValuesToString(regExp));

var allowedValuesWithDoubleQuoteRegExp = new RegExp(/\"[^\"]*[^\"]\"/g);
var allowedValuesWithQuoteRegExp = new RegExp(/\'[^\']*[^\']\'/g);
var allowedValuesRegExp = new RegExp(/[^,\s]+/g);

function parse(content, source) {
    // return apiParser.parse(content, source);

    content = trim(content);

    // replace Linebreak with Unicode
    content = content.replace(/\n/g, '\uffff');

    var matches = parseRegExp.exec(content);

    if ( ! matches)
        return null;

    var allowedValues = matches[4];
    if (allowedValues) {
        var regExp;
        if (allowedValues.charAt(0) === '"')
            regExp = allowedValuesWithDoubleQuoteRegExp;
        else if (allowedValues.charAt(0) === '\'')
            regExp = allowedValuesWithQuoteRegExp;
        else
            regExp = allowedValuesRegExp;

        var allowedValuesMatch;
        var list = [];

        while ( (allowedValuesMatch = regExp.exec(allowedValues)) ) {
            list.push(allowedValuesMatch[0]);
        }
        allowedValues = list;
    }

    // Replace Unicode Linebreaks in description
    if (matches[5])
        matches[5] = matches[5].replace(/\uffff/g, '\n');

    return {
        type         : matches[2],
        description  : unindent(matches[5] || '')
    };
}

/**
 * Exports
 */
module.exports = {
    parse         : parse,
    path          : 'local.return',
    method        : 'insert',
    markdownFields: [ 'description', 'type' ],
    markdownRemovePTags: [ 'type' ]
};
