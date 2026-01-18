# Sync Newsletter Articles from Medium

Fetch new articles from Medium and create a PR to add them to the website.

## Overview

This command fetches the MindfulOpus Medium RSS feed, compares against existing articles in `src/data/articles.json`, and creates a PR with any new articles found.

## Medium Info

- Profile: @MindfulOpus
- URL: `https://medium.com/@MindfulOpus`
- RSS Feed: `https://medium.com/feed/@MindfulOpus`

## Steps

### 1. Fetch Medium RSS Feed

Use curl to fetch the RSS feed:

```bash
curl -s "https://medium.com/feed/@MindfulOpus"
```

The feed returns XML with `<item>` elements containing:
- `<title>` - Article title
- `<link>` - Full URL to the article on Medium
- `<guid>` - Unique permalink ID (e.g., `https://medium.com/p/7711b84fce0a`)
- `<pubDate>` - Publication date (RFC 2822 format)
- `<category>` - Tags/categories (multiple)
- `<content:encoded>` - Full HTML content

### 2. Read Current Articles

Read `src/data/articles.json` to get the current list of articles.

### 3. Identify New Articles

Compare Medium articles against existing articles:
- Match by `guid` (the unique Medium post ID)
- New articles are ones not already in the JSON file

### 4. Create New Article Entries

For each new article, create an entry matching this schema:

```json
{
  "id": "<guid from Medium, e.g., 7711b84fce0a>",
  "title": "<title from Medium>",
  "excerpt": "<first 1-2 sentences from content, cleaned of HTML>",
  "date": "<YYYY-MM-DD from pubDate>",
  "categories": ["<category1>", "<category2>"],
  "link": "<full URL to article on Medium>"
}
```

Notes:
- Extract the short ID from the guid (e.g., `7711b84fce0a` from `https://medium.com/p/7711b84fce0a`)
- Clean HTML from excerpt, keep it to ~150-200 characters
- Convert pubDate to YYYY-MM-DD format
- Include up to 3 categories/tags

### 5. Update articles.json

Add new articles to the TOP of the `articles` array (newest first).
Keep the JSON properly formatted.

### 6. Create Branch and PR

Create a feature branch with timestamp:

```bash
git checkout -b newsletter-sync-$(date +%Y%m%d%H%M%S)
```

Stage, commit, and push:

```bash
git add src/data/articles.json
git commit -m "Add new newsletter article(s): <article titles>"
git push -u origin HEAD
```

Create a PR:

```bash
gh pr create --title "New newsletter article(s)" --body "$(cat <<'EOF'
## Summary
- Added X new article(s) from Medium

## New Articles
- "Article Title 1"
- "Article Title 2"

## Checklist
- [ ] Article titles and excerpts look correct
- [ ] Preview site renders correctly

EOF
)"
```

## Output

Report:
1. How many new articles were found
2. List of new article titles added
3. Link to the created PR

If no new articles are found, report that the site is already up to date.

## Error Handling

- If curl fails, try again or report the error
- If the RSS feed format changes, attempt to adapt or ask for help
- If git operations fail, diagnose and fix or report the issue
