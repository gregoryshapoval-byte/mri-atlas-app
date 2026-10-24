"""One-time owner-authorized cleanup after preserving current source and release."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import urllib.parse
import urllib.request

ROOT = 'https://api.github.com/repos/' + os.environ['GITHUB_REPOSITORY']
TOKEN = os.environ['GH_TOKEN']
KEEP = {'atlas-2.41', 'atlas-1.83-personal-backup', 'source-archive-1'}
result = {'deleted_branches': [], 'deleted_releases': [], 'deleted_tags': [],
          'deleted_artifacts': [], 'closed_prs': [], 'kept_releases': sorted(KEEP)}


def api(path, method='GET', body=None):
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(ROOT + path, data=data, method=method, headers={
        'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28'})
    with urllib.request.urlopen(request, timeout=60) as response:
        raw = response.read()
    return json.loads(raw) if raw else None


def pages(path, key=None):
    collected = []
    for page in range(1, 100):
        data = api(path + ('&' if '?' in path else '?') + f'per_page=100&page={page}')
        items = data[key] if key else data
        collected.extend(items)
        if len(items) < 100:
            return collected
    raise RuntimeError('Unexpected pagination size')


def main():
    snapshot = json.loads(Path('review/github-cleanup-2026-10-24.json').read_text())
    current = os.environ['GITHUB_SHA']
    if api('/git/ref/heads/main')['object']['sha'] != current:
        raise RuntimeError('Main changed since this run started; cleanup stopped')
    # The consolidation commit must retain every old branch/tag commit in history.
    for entry in snapshot['branches'] + snapshot['tags']:
        subprocess.run(['git', 'merge-base', '--is-ancestor', entry['sha'], 'HEAD'], check=True)
    releases = pages('/releases')
    by_tag = {r['tag_name']: r for r in releases}
    assert KEEP.issubset(by_tag), 'Required release missing'
    latest = by_tag['atlas-2.41']
    assert any(a['name'] == 'MRIAtlas-2.41.apk' and a['size'] > 100_000_000 for a in latest['assets'])
    backup = by_tag['atlas-1.83-personal-backup']
    asset = next(a for a in backup['assets'] if a['name'] == 'MRIAtlas-test-signing-key.zip')
    with urllib.request.urlopen(asset['browser_download_url'], timeout=60) as response:
        assert hashlib.sha256(response.read()).hexdigest() == '21e95c8f3b3b57579f8ad930e5dd011a7800efccc00750b003d70a5a9d9c87c6'
    assert any(a['name'] == 'net.imaios.eanatomy.zip' for a in by_tag['source-archive-1']['assets'])
    allowed_branches = {b['name']: b['sha'] for b in snapshot['branches'] if b['name'] != 'main'}
    actual_branches = pages('/branches')
    for branch in actual_branches:
        name = branch['name']
        if name in allowed_branches:
            assert branch['commit']['sha'] == allowed_branches[name], f'Branch changed: {name}'
    # All validation precedes the first delete.
    for pr in pages('/pulls?state=open'):
        if pr['head']['ref'] in allowed_branches and pr['head']['sha'] == allowed_branches[pr['head']['ref']]:
            api(f"/pulls/{pr['number']}", 'PATCH', {'state': 'closed'})
            result['closed_prs'].append(pr['number'])
    for branch in actual_branches:
        if branch['name'] in allowed_branches:
            api('/git/refs/heads/' + urllib.parse.quote(branch['name'], safe=''), 'DELETE')
            result['deleted_branches'].append(branch['name'])
    old_release_ids = {r['id'] for r in snapshot['releases'] if r['tag'] not in KEEP}
    for release in releases:
        if release['id'] in old_release_ids:
            api(f"/releases/{release['id']}", 'DELETE')
            result['deleted_releases'].append(release['tag_name'])
    # The key backup stays at its stable URL; discard only its obsolete APK files.
    for asset in backup['assets']:
        if asset['name'] != 'MRIAtlas-test-signing-key.zip':
            api(f"/releases/assets/{asset['id']}", 'DELETE')
    existing_tags = {t['name']: t['commit']['sha'] for t in pages('/tags')}
    for tag in snapshot['tags']:
        if tag['name'] not in KEEP and tag['name'] in existing_tags:
            api('/git/refs/tags/' + urllib.parse.quote(tag['name'], safe=''), 'DELETE')
            result['deleted_tags'].append(tag['name'])
    for artifact in pages('/actions/artifacts', 'artifacts'):
        if artifact['name'].startswith('MRIAtlas-') and not artifact['name'].startswith('MRIAtlas-2.41'):
            api(f"/actions/artifacts/{artifact['id']}", 'DELETE')
            result['deleted_artifacts'].append(artifact['name'])
    result['remaining_branches'] = [b['name'] for b in pages('/branches')]
    result['remaining_releases'] = [r['tag_name'] for r in pages('/releases')]


try:
    main()
finally:
    Path('build').mkdir(exist_ok=True)
    Path('build/github-cleanup-result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False))
