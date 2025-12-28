export function getByPath(obj: any, path: string): any {
    if (!path) return undefined;
    return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}
