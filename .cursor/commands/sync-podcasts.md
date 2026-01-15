# Sync Podcasts from YouTube

Fetch new podcast episodes from YouTube and create a PR to add them to the website.

## Overview

This command scrapes the MindfulOpus YouTube channel RSS feed, compares against existing episodes in `src/data/episodes.json`, and creates a PR with any new episodes found.

## YouTube Channel Info

- Channel: @mindfulopus
- Channel ID: `UCSQ30TkoFts1rOieeotVcPQ`
- RSS Feed: `https://www.youtube.com/feeds/videos.xml?channel_id=UCSQ30TkoFts1rOieeotVcPQ`

## Steps

### 1. Fetch YouTube RSS Feed

Use curl to fetch the RSS feed:

```bash
curl -s "https://www.youtube.com/feeds/videos.xml?channel_id=UCSQ30TkoFts1rOieeotVcPQ"
```

The feed returns XML with `<entry>` elements containing:
- `<yt:videoId>` - The YouTube video ID
- `<title>` - Video title
- `<published>` - ISO date string
- `<media:description>` - Full description

### 2. Read Current Episodes

Read `src/data/episodes.json` to get the current list of episodes.

### 3. Identify New Episodes

Compare YouTube videos against existing episodes:
- Match by title (episodes may have slightly different titles)
- Match by YouTube video ID in the `links.youtube` URL
- Filter out non-podcast content (look for episode patterns in title/description)

Podcast episodes typically have titles like:
- "Episode Title" (solo episodes)
- "Guest Name: Topic" (interviews)
- "Welcome to..." (trailer)

Skip videos that are clearly not podcast episodes (shorts, promos, etc).

### 4. Create New Episode Entries

For each new episode, create an entry matching this schema:

```json
{
  "id": <next_id>,
  "title": "<title from YouTube>",
  "description": "<first 1-2 sentences from YouTube description, cleaned up>",
  "date": "<YYYY-MM-DD from published date>",
  "duration": "<estimate or leave as 'TBD'>",
  "season": 1,
  "episodeNumber": <infer from title or sequence>,
  "links": {
    "spotify": "https://open.spotify.com/search/MindfulOpus%20podcast",
    "youtube": "https://www.youtube.com/watch?v=<videoId>",
    "applePodcast": "https://podcasts.apple.com/us/podcast/mindfulopus/id1843249943"
  }
}
```

Notes:
- Use the generic Spotify/Apple search links (they'll find the right episode)
- Extract a clean, concise description from the YouTube description
- Duration can be "TBD" if not easily determined
- Episode numbers should continue from the highest existing number
- Add `"isTrailer": true` only for trailer/welcome episodes

### 5. Update episodes.json

Add new episodes to the TOP of the `episodes` array (newest first).
Keep the JSON properly formatted.

### 6. Create Branch and PR

Create a feature branch with timestamp:

```bash
git checkout -b podcast-scrape-$(date +%Y%m%d%H%M%S)
```

Stage, commit, and push:

```bash
git add src/data/episodes.json
git commit -m "Add new podcast episode(s): <episode titles>"
git push -u origin HEAD
```

Create a PR:

```bash
gh pr create --title "New podcast episode(s)" --body "$(cat <<'EOF'
## Summary
- Added X new episode(s) from YouTube

## New Episodes
- Episode N: "Title"

## Checklist
- [ ] Episode titles and descriptions look correct
- [ ] Episode numbers are sequential
- [ ] Preview site renders correctly

EOF
)"
```

## Output

Report:
1. How many new episodes were found
2. List of new episode titles added
3. Link to the created PR

If no new episodes are found, report that the site is already up to date.

## Error Handling

- If curl fails, try again or report the error
- If the RSS feed format changes, attempt to adapt or ask for help
- If git operations fail, diagnose and fix or report the issue
