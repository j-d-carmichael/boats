import { InjectorConfig } from '@/interfaces/Injector';

export default function (conf: InjectorConfig[]): string {
  if (!Array.isArray(conf)) {
    throw new Error('The BOATS helper "inject" should be an array of inject objects');
  }
  if (!global.boatsInject) {
    global.boatsInject = conf;
    let warn = false;
    conf.forEach((confItem) => {
      if (Object.keys(confItem.toAllOperations).includes('exclude')) {
        warn = true;
      }
    });
    if (warn) {
      console.error('DEPRECATION WARNING: The inject helper will soon no longer support "exclude: []" please use "excludeChannels: []" instead. This feature will be removed in a future release');
    }
  }
  return '';
}
