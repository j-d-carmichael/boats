import { StringStyle } from '@/enums/StringStyle';
import { BoatsRC } from './interfaces/BoatsRc';
import fs from 'fs-extra';
import path from 'path';
import { MethodAliasPosition } from '@/enums/MethodAliasPosition';

class GetCheckCorrectBoatsRc {
  boatsRc: BoatsRC;

  /**
   * Finds, parses and validates the boatsrc file
   */
  getBoatsConfig () {
    const boatsrc = path.join(process.cwd(), '.boatsrc');
    const baseOptions = {
      autoescape: false,
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '{#',
        commentEnd: '#}',
      },
    };
    try {
      const json = fs.readJsonSync(boatsrc);
      if (json.nunjucksOptions) {
        json.nunjucksOptions = Object.assign(baseOptions, json.nunjucksOptions);
      }
      return this.parse(json);
    } catch (e) {
      return {};
    }
  }

  parse (boatsRc: BoatsRC): BoatsRC {
    this.boatsRc = boatsRc;
    this.permissionConfigStyleCheck();
    this.permissionConfigPrefixesCheck();
    this.permissionConfigAliasChecks();
    this.jsonSchemaRefParserBundleOpts();
    return this.boatsRc;
  }

  stringStyleCheck (input: string): void {
    if (!Object.values(StringStyle).includes(input as any)) {
      console.warn(`WARNING: StringStyle provided does not match any of the available options, provided "${input}"`);
      console.warn(`Available styles: ${Object.values(StringStyle)}`);
    }
  }

  permissionConfigStyleCheck (): void {
    if (this.boatsRc?.permissionConfig?.permissionStyle) {
      this.stringStyleCheck(this.boatsRc.permissionConfig.permissionStyle);
    }
    if (this.boatsRc?.permissionConfig?.permissionSegmentStyle) {
      this.stringStyleCheck(this.boatsRc.permissionConfig.permissionSegmentStyle);
    }
  }

  permissionConfigPrefixesCheck (): void {
    if (typeof this.boatsRc?.permissionConfig?.usePackageJsonNameAsPrefix !== 'undefined') {
      console.warn('Deprecation warning: permissionConfig.usePackageJsonNameAsPrefix will be removed in the future, please use permissionConfig.globalPrefix');
      this.boatsRc.permissionConfig.globalPrefix = this.boatsRc.permissionConfig.usePackageJsonNameAsPrefix;
      delete this.boatsRc.permissionConfig.usePackageJsonNameAsPrefix;
    }
    if (typeof this.boatsRc.permissionConfig.routePrefix !== 'undefined') {
      console.warn('Deprecation warning: permissionConfig.routePrefix will be removed in the future, please use permissionConfig.methodAlias');
      this.boatsRc.permissionConfig.methodAlias = this.boatsRc.permissionConfig.routePrefix;
      delete this.boatsRc.permissionConfig.routePrefix;
    }
  }

  permissionConfigAliasChecks () {
    this.boatsRc.permissionConfig = this.boatsRc.permissionConfig || {};
    if (!this.boatsRc.permissionConfig.methodAliasPosition) {
      this.boatsRc.permissionConfig.methodAliasPosition = MethodAliasPosition.AfterGlobalPrefix;
    }
  }

  jsonSchemaRefParserBundleOpts (): void {
    if (process.env.jsonSchemaRefParserBundleOpts) {
      try {
        this.boatsRc.jsonSchemaRefParserBundleOpts = JSON.parse(process.env.jsonSchemaRefParserBundleOpts);
        console.log('process.env.jsonSchemaRefParserBundleOpts parsed successfully.');
      } catch (e) {
        throw new Error('Error parsing process.env.jsonSchemaRefParserBundleOpts, invalid JSON provided.');
      }
    }
  }
}

export default new GetCheckCorrectBoatsRc();
