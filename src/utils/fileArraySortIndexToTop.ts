export default (input: string[]) => {
  const newinput: string[] = JSON.parse(JSON.stringify(input));
  newinput.sort((a: string, b: string) => {
    // Split paths into components
    const aParts = a.split('/');
    const bParts = b.split('/');
    const minLength = Math.min(aParts.length, bParts.length);

    // Compare directory paths
    for (let i = 0; i < minLength - 1; i++) {
      if (aParts[i] !== bParts[i]) {
        return aParts[i].localeCompare(bParts[i]);
      }
    }

    // If directories are the same, prioritize 'index'
    if (aParts[minLength - 1].includes('index') && !bParts[minLength - 1].includes('index')) {
      return -1;
    }
    if (bParts[minLength - 1].includes('index') && !aParts[minLength - 1].includes('index')) {
      return 1;
    }

    // If directories and file names are the same, or neither is 'index', sort by file name
    return aParts[minLength - 1].localeCompare(bParts[minLength - 1]);
  });
  return newinput;
}

