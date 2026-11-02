#!/usr/bin/env python3
"""Commit only explicitly selected paths and push once; never force or delete."""
import argparse
import subprocess


def run(*args, capture=False):
    return subprocess.check_output(args, text=True).strip() if capture else subprocess.run(args, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--message', required=True)
    parser.add_argument('--commit-only', action='store_true')
    parser.add_argument('paths', nargs='+', help='Explicit repository-relative files or directories')
    args = parser.parse_args()
    root = run('git', 'rev-parse', '--show-toplevel', capture=True)
    import os
    os.chdir(root)
    if run('git', 'branch', '--show-current', capture=True) != 'main':
        parser.error('Run on main after verifying the current source state')
    if run('git', 'diff', '--cached', '--name-only', capture=True):
        parser.error('Index already contains changes; review them before continuing')
    from pathlib import Path
    for path in args.paths:
        resolved = Path(path).resolve()
        if Path(root) not in resolved.parents or path.startswith(':'):
            parser.error('Use explicit paths inside the repository, never the entire repository')
    if not args.commit_only:
        run('git', 'fetch', '--quiet', 'origin', 'main')
        run('git', 'merge-base', '--is-ancestor', 'origin/main', 'HEAD')
    run('git', 'add', '--', *args.paths)
    selected = run('git', 'diff', '--cached', '--name-only', capture=True).splitlines()
    forbidden = [p for p in selected if p.lower().endswith(('.apk', '.jks', '.keystore')) or 'build' in Path(p).parts]
    if forbidden:
        run('git', 'reset', '--quiet', 'HEAD', '--', *selected)
        parser.error('APK, build output or signing key selected; index restored, files unchanged')
    if not run('git', 'diff', '--cached', '--name-only', capture=True):
        print('No changes selected')
        return
    run('git', 'diff', '--cached', '--stat')
    run('git', 'commit', '-m', args.message)
    if not args.commit_only:
        run('git', 'push', '--porcelain', 'origin', 'HEAD:refs/heads/main')
    print('Saved commit:', run('git', 'rev-parse', 'HEAD', capture=True))


if __name__ == '__main__':
    main()
