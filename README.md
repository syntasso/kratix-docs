# Release digest record

This branch holds the release digest's release record, `release-record.json`:
which SKE releases are in which HubSpot digest email, and each digest's Slack
message, hold-end ping and hold end.

The Release digest workflow (`.github/workflows/release-digest.yml` on `main`)
reads the record from this branch and commits to it after each run that
changes it. It lives here, not on `main`, because `main` only takes changes
through a pull request.

Do not delete this branch. Without it the workflow stops, rather than treat
every release as new. Edit the record by hand only when no digest run is in
progress, and push a normal commit; do not force-push.
