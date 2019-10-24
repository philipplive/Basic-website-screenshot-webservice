'use strict';

class Command {
    /**
     * Path to the file
     * @param {String} path 
     */
    constructor(path) {
        this.path = path;
        this.parameters = {};
    }

    /**
     * Add parameter
     * @param {string} name 
     * @param {string} value 
     */
    addParameter(name, value) {
        this.parameters[name] = value;
    }

    /**
     * Add multiple parameters
     * @param {Object} parameters 
     */
    addParameters(parameters) {
        Object.assign(this.parameters, parameters, this.parameters);
    }

    /**
     * @returns {string}
     */
    prints() {
        let str = this.path;

        Object.keys(this.parameters).forEach((key) => {
            if (this.parameters[key])
                str += ' ' + key + '=' + this.parameters[key];
            else
                str += ' ' + key;
        });

        return str;
    }
}

module.exports = Command;