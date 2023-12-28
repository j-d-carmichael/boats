import { InjectorConfig } from '@/interfaces/Injector';

export default function (conf: InjectorConfig[]): string {
  if (!Array.isArray(conf)) {
    throw new Error('The BOATS helper "inject" should be an array of inject objects');
  }

  // @ts-ignore
  if (!global.boatsInject) {
    // @ts-ignore
    global.boatsInject = conf;
  }
  return '';
}
