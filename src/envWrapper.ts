//simple function to replace an external dependency, will be swapped for some other method
export function getEnv(lookup: string): string {
  return process.env[lookup] || ""
}
