import cloneObject from '@/cloneObject';

const defaultOpenAPIOrder = [
  'tags',
  'summary',
  'description',
  'operationId',
  'security'
];

const defaultAsyncAPIChannelOrder = [
  'description',
  'publish',
  'subscribe'
];

class SortAttributes {
  forOpenAPI (bundled: any, pathAttrOrderMap = defaultOpenAPIOrder) {
    const obj: any = cloneObject(bundled);
    for (const path in obj.paths) {
      for (const verb in obj.paths[path]) {
        obj.paths[path][verb] = this.orderObjectAttributes(
          this.customSort(
            Object.keys(obj.paths[path][verb]),
            pathAttrOrderMap
          ),
          obj.paths[path][verb]
        );
      }
    }
    return obj;
  }

  forAsyncAPI (bundled: any, channelAttrOrderMap = defaultAsyncAPIChannelOrder) {
    const obj: any = cloneObject(bundled);
    for (const channel in obj.channels) {
      obj.channels[channel] = this.orderObjectAttributes(
        this.customSort(
          Object.keys(obj.channels[channel]),
          channelAttrOrderMap
        ),
        obj.channels[channel]
      );
    }
    return obj;
  }

  orderObjectAttributes (inputArray: string[], inputObject: any) {
    if (!inputObject || typeof inputObject !== 'object') {
      return {};
    }
    const orderedObject: any = {};
    inputArray.forEach(attribute => {
      orderedObject[attribute] = inputObject[attribute];
    });
    return orderedObject;
  }

  customSort (input: string[], map: string[]): string[] {
    const sortedFinal = input.slice().sort();
    const inputSet = new Set(input);
    const result = [];

    // Add elements in the "map" order given then add the remaining
    for (const item of map) {
      if (inputSet.has(item)) {
        result.push(item);
      }
    }
    for (const item of sortedFinal) {
      if (!result.includes(item) && inputSet.has(item)) {
        result.push(item);
      }
    }

    return result;
  }
}

export default new SortAttributes();
