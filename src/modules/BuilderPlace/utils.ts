export function generateSubdomainPrefix(name: string): string {
  // Remove any non-alphanumeric characters and replace spaces with hyphens
  const alphanumericName = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
  // Convert to lowercase and truncate to 63 characters (the maximum length for a subdomain)
  const subdomainPrefix = alphanumericName.toLowerCase().substring(0, 63);
  return subdomainPrefix;
}

export function getDomainPrefix(domain: string, apexName: string): React.ReactNode {
  return domain.slice(0, domain.length - apexName.length - 1);
}

export const slugify = (str: string) => {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};
