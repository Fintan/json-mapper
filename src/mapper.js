import jp from 'jsonpath';

function map({ inputObj, schema, template }) {
    return createFromTemplate({ inputObj, schema, template });
}

function createFromTemplate({inputObj, schema, template}) {
    const baseObj = Object.assign({}, template);
    schema.forEach(mapping => {
        var fromNodes = jp.nodes(inputObj, mapping.from);
        var toNodes = jp.nodes(baseObj, mapping.to);
        if(!fromNodes[0]) {
            throw new Error(`Mapping '${mapping.from}' returns undefined from legacy config`);
        }

        if(!toNodes[0]) {
            throw new Error(`Mapping '${mapping.to}' returns undefined in 2.0 config template`);
        }

        function getParentPath(path) {
            return path.substring(0, path.lastIndexOf('['));
        }

        //set the target array to same length as origin array first
        if(fromNodes.length > toNodes.length) {
            const defaultItem = toNodes[0] ? jp.query(baseObj, getParentPath(jp.stringify(toNodes[0].path)))[0] : {};
            const templateItem = Object.assign({}, defaultItem[0] || {});
            setValue(baseObj, getParentPath(jp.stringify(toNodes[0].path)), fromNodes.map(()=> Object.assign({}, templateItem)));
            toNodes = jp.nodes(baseObj, mapping.to); //update toNodes result set so that it == fromNodes.length
        }

        toNodes.forEach((tnode) => {
            if(fromNodes.length > 1) {
                fromNodes.forEach((fnode, j) => {
                    const toPath = jp.stringify(toNodes[j].path);
                    const fromPath = jp.stringify(fromNodes[j].path);
                    const fromValue = jp.query(inputObj, fromPath)[0];
                    setValue(baseObj, toPath, fromValue);
                })
            }else {
                //simple 1:1 use case
                setValue(baseObj, jp.stringify(tnode.path), jp.query(inputObj, jp.stringify(fromNodes[0].path))[0]);
            }
        });

    });
    return baseObj;
};

/*
 *  Navigates a context to retrieve an attribute that may be nested
 *
 *  @param {object} context
 *  @param {String} path expecting a conventional path to an attribute (not an xpath)
 */
function getValue(context, path) {
    return safeGet(context, prepPath(path));
}

function setValue(context, path, value) {
    return safeSet(context, prepPath(path), value);

}

function prepPath(path) {
    return path.replace('$.', '').split('.').map((part) => {
        if(part.indexOf('[') > -1) {
            const p =  part.split('[').map(subpart => {
                return subpart.lastIndexOf(']') > -1 ? `.${subpart.replace(']', '')}` : subpart;
            }).join('');
            return p;
        }
        return part;
    }).join('.');
}

/**
  * Safely navigates a context to retrieve an attribute that may be nested
  * 
  * @param {object} context
  * @param {string} attribute the name of the attribute, period delimtied if nested
  * @returns {Object|Undefined} the value of attribute.
  */
function safeGet(context, attribute) {
    var attrs = attribute.split('.'),
        ob = context[attrs.shift()];
    while(attrs.length) {
        if(ob === undefined) {
            break;
        }
        ob = ob[attrs.shift()]; 
    }
    return ob;
}

function safeSet(context, attribute, value) {
    let attrs = attribute.split('.');
    let ob = context;
    let nextLevel;
    while(attrs.length - 1) {
        nextLevel = ob[attrs[0]];
        if(nextLevel !== undefined) {
            ob = nextLevel;
            attrs.shift();
        }else {
            break;
        }
    }
    if(attrs.length === 1) {
        return ob[attrs[0]] = value;
    }else {
        console.log('issue setting', attribute);
        return undefined;
    }
}



/**
* Determine type of object.
*
* @param {object} obj
* @returns {string} string,number,object,boolean,array
*/
/*function type(obj) {
    return Array.isArray(obj) ? 'array' : typeof obj;
}*/


export {
    map,
    getValue,
    setValue
};

