# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-file IT PMO Kanban demo for a fictitious bank (internal demo/training tool). The whole app is `index.html` with inline `<style>` and `<script>`. There is no build, lint, or test tooling; run it by opening the file in a browser (double-click, no server).

## Hard constraints (from the original spec)

- Vanilla HTML/CSS/JS only: no frameworks, bundler, npm, CDN, web fonts, or image files. Icons are inline SVG or Unicode.
- No persistence of any kind: no localStorage, sessionStorage, IndexedDB, or cookies. A refresh resets the board to seed data, and the UI says so. (Note: the browser pane runs the file as a `data:` URL where `localStorage` access throws, so don't use it even for debugging.)
- No `!important` in CSS. Use only the CSS custom properties defined in `:root` for palette and spacing.
- No real bank logo or branding. Use the neutral "IT PMO" text wordmark. Task IDs are `UOB-ITPM-####` (zero-padded counter).
- The only network call is the FormSubmit AJAX endpoint (`notifyNewTask`). Never send the user's email anywhere else. The endpoint is the `FORMSUBMIT_ENDPOINT` constant at the top of the script, currently a `YOUR_EMAIL@example.com` placeholder.

## Architecture

Everything flows through one `state` object (`tasks`, `filters`, plus UI-only `confirmingId`, `draggingId`, `nextId`). The pattern is: mutate `state` in `addTask` / `moveTask` / `deleteTask`, then call `renderBoard()`, which rebuilds the whole board from `state` via `innerHTML` (and `renderSummary()` for the header strip). Never edit card DOM directly. After a re-render, `renderBoard()` restores keyboard focus by matching `data-action` and `data-id`, so new interactive card controls need those attributes to keep focus.

- Card and column events use delegation on `#board` (`wireEvents`): clicks for delete ask/yes/no, `change` for the keyboard "Move ▸" select, and native HTML5 `dragstart`/`dragover`/`dragleave`/`drop`/`dragend` for drag-and-drop. Columns carry `data-status`, and cards carry `data-id`.
- Filter controls and the Add Task `<dialog>` live outside `#board`, so re-rendering doesn't reset their input focus.
- Delete confirmation is an inline Yes/No state (`state.confirmingId`), not `confirm()`.
- All user-supplied strings must go through `escapeHtml()` before being placed in HTML.
- Add flow (`handleSubmit`): validate (`validateForm`, inline errors, no `alert()`), add the card optimistically, reset and close the form, show a toast, then `await notifyNewTask()` in try/catch. Failure only shows a warning toast and never breaks the board.
- Overdue means `dueDate` is before today and `status !== "Done"`. Dates are `YYYY-MM-DD` strings compared lexically, built in local time (`toDateString`). Seed due dates are offsets from today (`dateOffset`), so the overdue seeds stay overdue.
- Lists such as `STATUSES`, `PROJECTS`, `CATEGORIES`, and `PRIORITIES` are constants at the top of the script and drive both the form selects and the filters.
