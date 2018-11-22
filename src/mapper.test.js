import { 
    map,
    getValue,
    setValue
} from './mapper';
import simpleInput from 'configs/simple-input.json';
import simpleOutput from 'configs/simple-output.json';
import simpleSchema from 'configs/simple-schema.json';
import arraySampleInput from 'configs/array-sample-input.json';
import arraySampleSchema from 'configs/array-sample-schema.json';
import mcqInput from 'configs/mcq-old.json';
import mcqSchema from 'configs/mcq-schema.json';

test('can safely navigate to an attribute on an object', () => {
    const obj = Object.assign({}, arraySampleInput);
    expect(getValue(obj, 'audioSchema')).toBe(obj.audioSchema);
    expect(getValue(obj, 'activity.options')).toBe(obj.activity.options);
});

test('can safely navigate to an item in an array', () => {
    const obj = Object.assign({}, arraySampleInput);
    expect(getValue(obj, '$.letters[0]')).toBeDefined();
    expect(getValue(obj, '$.letters[0]')).toBe(obj.letters[0]);
    expect(getValue(obj, '$.activity.options[1]')).toBeDefined();
    expect(getValue(obj, '$.activity.options[1]')).toBe(obj.activity.options[1]);
});

test('can assign a value to an attribute', () => {
    const obj = Object.assign({}, arraySampleInput);
    expect(getValue(obj, '$.hello')).not.toBeDefined();
    expect(setValue(obj, '$.hello', 'world')).toBe(obj.hello);
    expect(setValue(obj, '$.hello', 'world')).toBe('world');
    expect(setValue(obj, '$.activity.nested', 'new val')).toBe(obj.activity.nested);
    expect(setValue(obj, '$.activity.nested', 'new val')).toBe('new val');
    expect(getValue(obj, '$.letters[4]')).not.toBeDefined();
    expect(setValue(obj, '$.letters[4]', '4thvalue')).toBe(obj.letters[4]);
    expect(setValue(obj, '$.letters[4]', '4thvalue')).toBe('4thvalue');
    expect(setValue(obj, '$.activity.options[1].audio.tags[2]', 'b&w')).toBe(obj.activity.options[1].audio.tags[2]);
});

test('converts simple input to desired output', () => {
    const result = map({ 
        inputObj: simpleInput, 
        schema: simpleSchema.mappings,
        template: simpleSchema.template
    });
    expect(result).toBeDefined();
    expect(result.additionalSettings.audio.src).toBe('../../audio/manifests/config.json');
    expect(result.additionalSettings.audio.schema).toBe('mrq_audio_schema.json');
});

test('throws an error if mappings return undefined', () => {
    expect(() => {
        map({ 
            inputObj: simpleInput, 
            schema: [{ "from": "$.audioFile",  "to": "$.does.not.exist" }],
            template: simpleSchema.template
        });
    }).toThrow();

    expect(() => {
        map({ 
            inputObj: simpleInput, 
            schema: [{ "from": "$.does.not.exist",  "to": "$.additionalSettings.audio.src" }],
            template: simpleSchema.template
        });
    }).toThrow();
});

test('converts input containing arrays to desired output', () => {
    const result = map({ 
        inputObj: arraySampleInput, 
        schema: arraySampleSchema.mappings,
        template: arraySampleSchema.template
    });
    expect(result).toBeDefined();
    expect(result.additionalSettings.audio.src).toBe('../../audio/manifests/config.json')
    expect(result.additionalSettings.audio.schema).toBe('mrq_audio_schema.json')
    expect(result.ids.join(',')).toContain('a,b,c,d');
    expect(result.items[0].title).toBe('a title 1')
});

test('converts a legacy mcq config to the version 2 structure', () => {
    const result = map({ 
        inputObj: mcqInput, 
        schema: mcqSchema.mappings,
        template: mcqSchema.template
    });
    expect(result).toBeDefined();
    expect(result.additionalSettings.audio.src).toBe('../../widget_data/audio_data/d9c49d9efbd3499f92a747787450beae.json')
    expect(result.additionalSettings.audio.schema).toBe('mcq_audio_schema.json')
    expect(result.items[1].itemId).toBe(1)
    expect(result.feedback.answers[0].itemId).toBe(0);
});
