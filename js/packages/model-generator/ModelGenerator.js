#! /usr/bin/node

import { readFile, writeFileSync } from 'fs';

import { colours } from '@js-scripts/common';
import {
    cleanLines,
    cloneThisProp,
    constructorArgv,
    constructorPropAssign,
    constructorPropDocs,
    fromDatabaseArgv,
    fromDatabaseConstructor,
    fromDatabasePropDocs,
    parseProp,
    returnsDocs,
    stringToCases,
    toDatabaseReturn,
} from './helpers.js';
import { REGEX } from './constants.js';

/**
 * @typedef Model
 * @property {import('./helpers.js').CasedString} table Name of the model
 * @property {import('./helpers.js').ModelProp[]} props Properties of the model to parse
 *

/**
 * Converts a MySQL exported model into a {@link Model} instance
 *
 * @param {string[]} lines Lines of the SQL file to parse into a `Model`
 * @returns {Model} The model instance
 */
const sqlToModel = (lines) => {
    let table = '';
    const props = [];

    lines.forEach((line) => {
        if (REGEX.lines.CREATE.test(line)) {
            table = stringToCases(line.split('`')[1].replace('tbl_', ''));
        } else if (REGEX.lines.PROP.test(line)) {
            props.push(parseProp(line));
        }
    });

    return { table, props };
};

/**
 *
 * @param {Model} model Model to create the constructor
 */
const modelConstructor = (model) => {
    const lines = [];

    lines.push('\t/**');
    lines.push(
        `\t * Default ${model.table.pascal}. By default all values are set to \`null\``
    );
    lines.push('\t * and arrays to empty array');
    lines.push('\t *');

    lines.push(...model.props.map(constructorPropDocs(model.table)));
    lines.push('\t */');

    lines.push('\tconstructor(');
    lines.push(...model.props.map(constructorArgv));
    // Remove coma from last parameter
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    lines.push('\t) {');

    lines.push(...model.props.map(constructorPropAssign));
    lines.push('\t}');

    return lines;
};

/**
 *
 * @param {Model} model
 * @returns
 */
const modelFromDatabase = (model) => {
    const lines = [];

    lines.push('\t/**');
    lines.push(
        `\t * Parses an \`object\` to a \`${model.table.pascal}\`. By default all values are set to \`null\``
    );
    lines.push('\t * and arrays to empty arrays');
    lines.push('\t *');

    lines.push('\t * @param {object} obj The database object');
    lines.push(...model.props.map(fromDatabasePropDocs));

    lines.push(
        `\t${returnsDocs(model.table, `The parsed \`${model.table.pascal}\``)}`
    );
    lines.push('\t */');

    lines.push('\tstatic fromDatabase({');
    lines.push(...model.props.map(fromDatabaseArgv));
    // Remove coma from last parameter
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    lines.push('\t}) {');

    lines.push(`\t\treturn new ${model.table.pascal}(`);
    lines.push(...model.props.map(fromDatabaseConstructor));
    // Remove coma from last parameter
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    lines.push('\t\t);');

    lines.push('\t}');

    return lines;
};

/**
 *
 * @param {Model} model Model to create the `toDatabase` method for
 * @returns {string[]} The lines of the js content indented
 */
const modelToDatabase = (model) => {
    const lines = [];

    lines.push('\t/**');
    lines.push('\t * Parses the class to its corresponding database `object`.');
    lines.push('\t *');

    lines.push(
        `\t * @param {\`${model.table.pascal}\`} ${model.table.camel} The \`${model.table.pascal}\` to parse to the database`
    );
    lines.push(`\t${returnsDocs('object', 'The parsed `object`')}`);
    lines.push('\t */');

    lines.push(`\tstatic toDatabase(${model.table.camel}) {`);
    lines.push('\t\treturn {');

    lines.push(...model.props.map(toDatabaseReturn(model.table)));
    // Remove coma from last parameter
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);

    lines.push('\t\t};');
    lines.push('\t};');

    return lines;
};

/**
 *
 * @param {Model} model The model to create the `clone` method for
 * @returns {string[]} The lines of the js content indented
 */
const modelClone = (model) => {
    const lines = [];

    lines.push('\t/**');
    lines.push(
        `\t * Clones the current ${model.table.pascal} properties to a new one`
    );
    lines.push('\t *');
    lines.push(
        `\t${returnsDocs(
            model.table,
            `A cloned instance of the current ${model.table.pascal}`
        )}`
    );
    lines.push('\t */');

    lines.push('\tclone() {');
    lines.push(`\t\treturn new ${model.table.pascal}(`);

    lines.push(...model.props.map(cloneThisProp));
    // Remove coma from last parameter
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);

    lines.push('\t\t);');
    lines.push('\t}');

    return lines;
};

/**
 * Creates the content as an array of strings for the given model.
 * Includes the `constructor`, `toDatabase`, `fromDatabase` and
 * the clone method. Each method also contains their documentation
 *
 * @param {Model} model Model to create the file for
 */
const modelToContent = (model) => {
    const lines = [];

    lines.push('/**', ` * Data class for the ${model.table.text}`, ' */');
    lines.push(`class ${model.table.pascal} {`);

    lines.push(...modelConstructor(model));

    lines.push('');

    lines.push(...modelFromDatabase(model));

    lines.push('');

    lines.push(...modelToDatabase(model));

    lines.push('');

    lines.push(...modelClone(model));

    lines.push('}');

    return lines;
};

/**
 * Converts a model into the JavaScript class
 *
 * @param {Model} model The model to parse
 */
const modelToSql = (model) => {
    const content = modelToContent(model);
    writeFileSync('out.js', content.join('\n'));
};

/**
 * Parses all the given files to their corresponding models
 *
 * @param  {...string} files Names of the files to parse
 */
const run = async (...files) => {
    for (const file of files) {
        readFile(file, (err, data) => {
            if (err) {
                console.log(
                    `${colours.fg.red}An error ocurred while reading [${file}]`
                );
            } else {
                const model = sqlToModel(cleanLines(data.toString()));
                modelToSql(model);
            }
        });
    }
};

const init = () => {
    const argvs = process.argv.slice(2);

    if (!argvs.length) {
        console.log(`${colours.fg.red}No file passed ${colours.reset}`);
    } else {
        run(...argvs);
    }
};

init();
