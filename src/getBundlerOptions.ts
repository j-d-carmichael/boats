import fs from 'fs-extra';
import $RefParser from '@apidevtools/json-schema-ref-parser';

export default (boatsrc: string): $RefParser.Options => {
  let jsonObject = {};
  if (process.env.jsonSchemaRefParserBundleOpts) {
    try {
      jsonObject = JSON.parse(process.env.jsonSchemaRefParserBundleOpts);
      console.log('process.env.jsonSchemaRefParserBundleOpts parsed successfully.')
    } catch (e) {
      throw new Error('Error parsing process.env.jsonSchemaRefParserBundleOpts, invalid JSON provided.');
    }
  } else if (fs.existsSync(boatsrc)) {
    try {
      const boatsJson = fs.readJsonSync(boatsrc);
      if (boatsJson.jsonSchemaRefParserBundleOpts) {
        jsonObject = boatsJson.jsonSchemaRefParserBundleOpts;
        console.log('.boatsrc jsonSchemaRefParserBundleOpts parsed successfully.')
      }
    } catch (e) {
      throw new Error('Error parsing .boatsrc file, invalid JSON provided.');
    }
  }
  return jsonObject;
}
