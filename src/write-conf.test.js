import mcqInput from 'configs/mcq-old.json';
import mcqSchema from 'configs/mcq-schema.json';
import { map } from './mapper';
import { writeConf } from './write-conf';

test('can create a config file using output from map module', () => {
    const result = map({ 
        inputObj: mcqInput, 
        mappings: mcqSchema.mappings,
        template: mcqSchema.template
    });
    expect(() => {
        writeConf({ contentObj: result, src: './mcq-new.json' });
    }).not.toThrow();
});
