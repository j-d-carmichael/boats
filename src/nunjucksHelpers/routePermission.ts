import routePermission from '@/routePermission';

interface RoutePermission {
  tail: string,
  removeMethod: boolean
}

export default function (input: RoutePermission | string): string {
  const tail = (typeof input === 'object') ? input.tail : input;
  const removeMethod = (typeof input === 'object') ? input.removeMethod : false;
  return routePermission(
    this.env.globals.boatsConfig,
    this.env.globals.currentFilePointer,
    this.env.globals.uniqueOpIdStripValue,
    tail,
    removeMethod
  );
}
