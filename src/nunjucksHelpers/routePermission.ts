import routePermission from '@/routePermission';

interface RoutePermission {
  prefix?: string;
  tail?: string;
  removeMethod?: boolean;
}

export default function (input: RoutePermission | string): string {
  const prefix = typeof input === 'object' ? input.prefix || '' : '';
  const tail = typeof input === 'object' ? input.tail || '' : input || '';
  const removeMethod = typeof input === 'object' ? input.removeMethod || false : false;
  return routePermission(
    this.env.globals.boatsConfig,
    this.env.globals.currentFilePointer,
    this.env.globals.uniqueOpIdStripValue,
    prefix,
    tail,
    removeMethod
  );
}
