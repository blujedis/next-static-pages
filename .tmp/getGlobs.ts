/**
 * Gets glob patterns for parsing files relative to project root directories.
 * 
 * @returns array of glob patters for parsing static files.
 */
function getGlobs(options?: IGlobOptions) {

  options = {
    dirs: opts.dirs,
    extensions: opts.extensions,
    recursive: opts.recursive,
    ...options
  };

  options.dirs = normalizeArray<string>(options.dirs);
  options.extensions = normalizeArray<string>(options.extensions);

  const { dirs, extensions, recursive } = options;

  let suffix = extensions.length > 1 ? `.{${extensions.join(',')}}` : `.${extensions[0]}`;
  suffix = recursive ? '**/*' + suffix : '*' + suffix;

  return dirs.map(v => (relative(process.cwd(), join(v, suffix))));

}