export type LogFunc = (msg: string) => void;

export type PackageManifest = {
  version?: string;
  name?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export type PackageInfo = {
  packageName: string;
  dir: string;
  dirName: string;
  packageFile: string;
  packageManifest: PackageManifest;
};
