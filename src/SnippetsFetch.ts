import 'colors';

import fs from 'fs-extra';
import path from 'path';

import { GIT_DIRECTORY_SNIPPET_CACHE } from '@/constants/CachePaths';
import commandRun from '@/utils/commandRun';
import camelCaseStringReplacement from '@/utils/camelCaseStringReplacement';

class SnippetsFetch {
  public targetGitCacheDir: string;

  /**
   * Returns the folder to store the git repos in
   */
  public getCacheFolder () {
    this.targetGitCacheDir = path.join(process.cwd(), GIT_DIRECTORY_SNIPPET_CACHE);
    return this.targetGitCacheDir;
  }

  /**
   * Generates a cache directory relative to the url given
   */
  public calculateLocalDirectoryFromUrl (url: string): string {
    const camelCaseUrl = camelCaseStringReplacement(url, ['/', ':', '.', '-', '?', '#']);
    const dir = path.join(this.getCacheFolder(), camelCaseUrl);
    fs.ensureDirSync(dir);
    return dir;
  }

  /**
   * Deletes the entire cache directory
   */
  public cleanSingleCacheDir (cachePath: string) {
    if (!cachePath.includes(this.targetGitCacheDir)) {
      console.error('For safety all folder removals must live within node_modules of this package.');
      console.error('An incorrect cache folder path has been calculated, aborting! Please report this as an issue on gitHub.');
      throw new Error('Aborting openapi-nodegen, see above comments.');
    }
    console.log('Removing the cacheDir: ' + cachePath);
    fs.removeSync(cachePath);
  }

  /**
   * Throws an error if gitFetch is not installed
   * @return {Promise<boolean>}
   */
  public async hasGit () {
    try {
      await commandRun('git', ['--help']);
      return true;
    } catch (e) {
      console.error('Git command not found on this operating system, please install git to continue.');
      return false;
    }
  }

  /**
   * Runs a simple cache exists on the proposed local file path
   * @param cachePath
   * @return {boolean}
   */
  public gitCacheExists (cachePath: string) {
    console.log('Checking for existing snippet cache: ' + cachePath);
    return fs.existsSync(cachePath);
  }

  /**
   * Fetches the contents of a gitFetch url to the local cache
   * @param {string} url - Url to fetch via gitFetch
   * @return {Promise<string>}
   */
  public async gitFetch (url: string) {
    if (!await this.hasGit()) {
      throw new Error('Could not fetch cache from gitFetch url as gitFetch is not locally installed');
    }
    const cacheDirectory = this.calculateLocalDirectoryFromUrl(url);
    const urlParts = this.getUrlParts(url);
    try {
      if (this.gitCacheExists(cacheDirectory) && !urlParts.b) {
        await this.gitPull(cacheDirectory);
      } else {
        this.cleanSingleCacheDir(cacheDirectory);
        await this.gitClone(urlParts.url, cacheDirectory, urlParts.b);
      }
    } catch (e) {
      console.error('Could not clone or pull the given git repository!');
      this.cleanSingleCacheDir(cacheDirectory);
      throw e;
    }
    return cacheDirectory;
  }

  /**
   * Changes directory then pulls an expected git repo
   * @param cacheDirectory
   * @return {Promise<boolean>}
   */
  public async gitPull (cacheDirectory: string) {
    const cwd = process.cwd();
    process.chdir(cacheDirectory);
    try {
      console.log('Updating git cache');
      await commandRun('git', ['pull']);
      process.chdir(cwd);
      return true;
    } catch (e) {
      process.chdir(cwd);
      throw e;
    }
  }

  /**
   * Clones a remote git url to a given local directory
   * @param url
   * @param cacheDirectory
   * @param gitBranchOrTag
   * @return {Promise<*>}
   */
  public async gitClone (url: string, cacheDirectory: string, gitBranchOrTag?: string) {
    console.log(`BOATS Snippets, clone git repository to: ${cacheDirectory}`);
    fs.ensureDirSync(cacheDirectory);
    if (gitBranchOrTag) {
      await commandRun('git', ['clone', '-b', gitBranchOrTag, url, cacheDirectory]);
    } else {
      await commandRun('git', ['clone', url, cacheDirectory]);
    }
  }

  /**
   *
   * @param {string} url
   * @return {{b: string, url: string}}
   */
  public getUrlParts (url: string): { url: string, b?: string } {
    let cloneUrl = url;
    let b;
    if (url.includes('#')) {
      const parts = url.split('#');
      cloneUrl = parts[0];
      b = parts[1];
    }
    return {
      url: cloneUrl,
      b
    };
  }

  /**
   * Returns local helpers name or full path to cached directory
   * @param {string} input - Either es6 | typescript | https github url |
   *                        local directory relative to where this package is called from
   * @return {Promise<string>} - Returns the full path on the local drive to the tpl directory.
   */
  public async resolve (input: string) {
    if (input.substring(0, 8) === 'https://') {
      return await this.gitFetch(input);
    } else {
      const localSnippetPath = path.join(__dirname, '../../snippets', input);
      // check local exists
      if (!fs.existsSync(localSnippetPath)) {
        throw new Error('Local snippet could not be found in the version of boats you are running: ' + localSnippetPath);
      }
      return localSnippetPath;
    }
  }
}

export default new SnippetsFetch();
