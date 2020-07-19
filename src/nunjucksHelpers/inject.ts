import { InjectorConfig } from '@/interfaces/Injector';

export default  function (conf: InjectorConfig[]): string {
  if (!Array.isArray(conf)) {
    throw new Error('The BOATS helper "inject" should be an array of inject objects')
  }
  if (!global.boatsInject) {
    global.boatsInject = conf
  }
  return ''
}
