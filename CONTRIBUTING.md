# Contribute to the documentation

This guide shows how to contribute to OneSwap docs.

## How to contribute

### Option 1: Edit directly on GitHub

1. Navigate to the page you want to edit
2. Click the "Edit this file" button (the pencil icon)
3. Make your changes and submit a pull request

### Option 2: Local development

1. Fork and clone this repository
2. Install the Mintlify CLI: `npm i -g mint`
3. Create a branch for your changes
4. Make changes
5. Run `mint dev` from the repository root
6. Preview your changes at `http://localhost:3000`
7. Commit your changes and submit a pull request

## Writing guidelines

- Use active voice and second person.
- Keep sentences concise.
- Use sentence case for headings.
- Use code formatting for commands, paths, and API fields.
- Use OneSwap terminology from `AGENTS.md`.

## Validation checklist

1. Run `mint broken-links`.
2. Confirm navigation in `mint.json` matches added pages.
3. Ensure examples do not include secrets.
