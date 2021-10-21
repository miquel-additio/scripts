export const REGEX = {
    lines: {
        CREATE: new RegExp('^(CREATE TABLE)'),

        // SQL export props start with `
        PROP: new RegExp('^`'),
    },
};

export const TYPES = {
    // Booleans
    BOOL: 'boolean',
    BOOLEAN: 'boolean',

    // Numbers
    BIT: 'number',
    TINYINT: 'number',
    SMALLINT: 'number',
    MEDIUMINT: 'number',
    INT: 'number',
    INTEGER: 'number',
    BIGINT: 'number',
    FLOAT: 'number',
    DOUBLE: 'number',
    'DOUBLE PRECISION': 'number',
    DECIMAL: 'number',
    DEC: 'number',

    // Strings
    CHAR: 'string',
    VARCHAR: 'string',
    BINARY: 'string',
    VARBINARY: 'string',
    TINYBLOB: 'string',
    TINYTEXT: 'string',
    TEXT: 'string',
    BLOB: 'string',
    MEDIUMTEXT: 'string',
    MEDIUMBLOB: 'string',
    LONGTEXT: 'string',
    LONGBLOB: 'string',
    ENUM: 'string',
    SET: 'string',

    // Date
    DATE: 'Date',
    DATETIME: 'Date',
    TIMESTAMP: 'Date',
    TIME: 'Date',
    YEAR: 'Date',
};
