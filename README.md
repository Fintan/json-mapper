# CPL Legacy Content Mapper

Transforms an object literal to an updated structure based on an array of xpath mappings and a template. 

## Installation

Make sure you have the @hmh npm registry setup.
Ignore the following lines if it's already setup on your computer.

```
npm config set @hmh:registry http://npm.tribalnova.com
npm adduser --registry http://npm.tribalnova.com
```

Package installation;

```
npm install @hmh/cpl-content-mapper
```


## Usage

```
import { map } from '@hmh/cpl-content-mapper';

const inputObj = {
    "audioFile": "../../audio/manifests/config.json",
    "audioSchema": "mrq_audio_schema.json"
};

const mappings = [
    { "from": "$.audioFile",  "to": "$.additionalSettings.audio.src" },
    { "from": "$.audioSchema",  "to": "$.additionalSettings.audio.schema" }
];

const template = {
    "additionalSettings": {
        "selectedLocale": "en-US",
        "audio": {
            "src": "",
            "schema": ""
        }
    }
};

const transformedObj = map({ 
    inputObj, 
    mappings,
    template
});


``