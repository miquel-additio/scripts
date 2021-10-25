import {
    toCamelCase,
    toPascalCase,
    toSentenceCase,
    toSnakeCase,
    toTextCase,
} from 'js-convert-case';
import { TYPES } from './constants.js';

/**
 * @typedef ModelProp
 * @property {CasedString} name Name of the current prop
 * @property {CasedString} type Type of the property
 * @property {string | undefined} default Default value if any of the property
 *
 * @typedef CasedString
 * @property {string} initial
 * @property {string} camel
 * @property {string} pascal
 * @property {string} snake
 * @property {string} text
 * @property {string} sentence
 */

/**
 * Cleans the file content by removing all white spaces and splits
 * them by new lines
 *
 * @param {string} str File of the SQL file to clean
 * @returns {string}
 */
export const cleanLines = (str) => str.replaceAll('\t', '').split('\n');

/**
 *
 * @param {string} str The string to parse
 * @returns {CasedString}
 */
export const stringToCases = (str) => ({
    initial: str,
    camel: toCamelCase(str),
    pascal: toPascalCase(str),
    snake: toSnakeCase(str),
    text: toTextCase(str),
    sentence: toSentenceCase(str),
});

/**
 * Parses an SQL propery line into a `ModelProp`
 *
 * @param {string} line Line of the SQL file to parse into a model
 * @returns {ModelProp}
 */
export const parseProp = (line) => {
    // Split the values in order to parse them separately
    const values = line.split(' ');
    // Check if there's a default value for such prop
    const iof = values.findIndex((value) => value === 'DEFAULT');

    return {
        name: stringToCases(values[0].split('`')[1]),
        type: stringToCases(values[1].split('(')[0]),
        default: iof !== -1 ? values[iof + 1] : undefined,
    };
};

/**
 * Creates a param clause of JsDoc for the given properties
 *
 * @param {object} obj
 * @param {ModelProp} obj.prop Property to pass convert into doc
 * @param {string | undefined} obj.desc Additional description to add to the prop
 * @param {"camel" | "pascal" | "snake" | "text" | "sentence"} obj.caseKey The key of the
 * case to use to print the name. By default, the case used is camel case
 * @param {boolean} nested If the prop is destructured in the method signature
 * @returns {string} The param clause as a JsDoc without being indented
 */
export const paramDocs = ({ prop, desc, caseKey = 'camel', nested = false }) =>
    ` * @param {${TYPES[prop.type.initial.toUpperCase()]}} ${
        nested ? 'obj.' : ''
    }${prop.name[caseKey]}${desc ? ` ${desc}` : ''}`;

/**
 * Parses a propertu to constructor property documentation indented
 *
 * @param {CasedString} name Name of the model
 * @returns {(prop: ModelProp) => string} A function that returns a
 * `constructor` docs indented
 * @see {@link paramDocs}
 */
export const constructorPropDocs = (name) => (prop) =>
    `\t${paramDocs({
        prop,
        desc: `${name.sentence} ${prop.name.text}`,
    })}`;

/**
 * Parses the prop to its `constructor` argument string value indented
 *
 * @param {ModelProp} prop Property of the model to parse
 * @returns A `constructor` argument indented
 */
export const constructorArgv = (prop) => `\t\t${prop.name.camel} = null,`;

/**
 * Parses the prop to its `constructor` prop assignation string value
 * indented
 *
 * @param {ModelProp} prop Property of the model to parse
 * @returns {string} A `constructor` assignation indented
 */
export const constructorPropAssign = (prop) =>
    `\t\tthis.${prop.name.camel} = ${prop.name.camel};`;

/**
 * Parses the prop to its `fromDatabase` prop assignation string value
 * indented
 *
 * @param {ModelProp} prop Property of the model to parse
 * @returns {string} A `fromDatabase` docs indented
 */
export const fromDatabasePropDocs = (prop) =>
    `\t${paramDocs({ prop, case: 'snake', nested: true })}`;

/**
 * Parses the prop to its `fromDatabase` prop argument string value
 * indented
 *
 * @param {ModelProp} prop Property of the model to parse
 * @returns {string} A `fromDatabase` argument indented
 */
export const fromDatabaseArgv = (prop) =>
    `\t\t${prop.name.initial.includes('_') ? `${prop.name.snake}: ` : ''}${
        prop.name.camel
    } = null,`;

/**
 * Parses the prop to its `fromDatabase` prop `constructor` param string value
 * indented
 *
 * @param {ModelProp} prop Property of the model to parse
 * @returns {string} A `fromDatabase` `constructor` param string indented
 */
export const fromDatabaseConstructor = (prop) => `\t\t\t${prop.name.camel},`;

/**
 * Parses the prop to its `toDatbase` return string value indented
 *
 * @param {CasedString} name Name of the table
 * @returns {(prop: ModelProp) => string} prop Property of the model to parse
 */
export const toDatabaseReturn = (name) => (prop) =>
    `\t\t\t${prop.name.snake}: ${name.camel}.${prop.name.camel},`;

/**
 * Parses a property into preffixing it with this and indenting it
 *
 * @param {ModelProp} prop Property to parse
 * @returns Parses a property into a `this.<prop-name>`. The returned string
 * is indented
 */
export const cloneThisProp = (prop) => `\t\t\tthis.${prop.name.camel},`;

/**
 * Creates a returns clause of JsDoc for the given `type`
 *
 * @param {string} type The type of the returned value
 * @param {string?} description Additional description to what is returned
 * @returns {string} The returns clause as a JsDoc withot being indented
 */
export const returnsDocs = (type, description) =>
    ` * @returns {${toPascalCase(type)}} ${description}`;
