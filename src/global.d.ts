declare module '*.css' {
  const content: unknown;
  export default content;
}

// Allow side-effect CSS imports
declare module '*.css?inline' {
  const content: string;
  export default content;
}