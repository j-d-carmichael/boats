import routePermission from '@/routePermission'

export default function (tail: string): string {
  return routePermission(
    this.env.globals.boatsConfig,
    this.env.globals.currentFilePointer,
    this.env.globals.uniqueOpIdStripValue,
    tail,
  );
}
