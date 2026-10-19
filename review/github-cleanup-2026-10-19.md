# GitHub cleanup · 19.10.2026

Main now contains the verified 1.65 application tree and manual-only CI. Consolidation commit: d182289327b3dfbc23596e7aaedf54d2ef22db07.

All 36 pre-cleanup branch heads are direct parents of that commit; every old history stays reachable from main. Checkpoints: review/github-checkpoints-2026-10-19.json. Compared the root trees: only AGENTS.md, CONTINUE.md and review changed; app, images, build tooling and workflow match the latest published branch.

Closed all 28 previously open pull requests; verified the open PR collection is empty. These were superseded by the consolidated release, without replaying obsolete intermediate implementations into the application.

Pending: delete the 35 non-main branch refs listed in the checkpoint manifest. The connected GitHub tools do not expose branch-ref deletion; browser fallback requires separate approval under the browser tool instructions. No branch refs, source files, old commits or build artifacts were deleted. The installed APK does not change.

Browser follow-up: user approved browser fallback. The page was signed out. A secure browserAuth request returned declined; credential entry was not retried. Branch deletion remains pending (35 non-main refs); no refs were deleted. This is an authentication blocker, not a source-history or APK problem.
