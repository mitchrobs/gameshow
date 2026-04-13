# Moji Mash Studio

A local web UI for drafting Moji Mash daily puzzles. Wraps the existing
`moji-mash-editor` Claude Code subagent (`.claude/agents/moji-mash-editor.md`)
in a chat + image gallery layout so you can iterate without juggling slash
commands and CLI invocations.

The agent runs in your browser via the Anthropic API and autonomously calls
local tools to read the puzzle pool, run `scripts/generate_moji.py`, and
promote winning variants. Image generation still runs locally on Apple
Silicon — Studio is a control surface, not a replacement.

## Requirements

- Apple Silicon Mac (mflux requirement)
- Node 20+
- Python 3.11 venv at `~/tools/open-genmoji` per the moji mash style guide
- `ANTHROPIC_API_KEY` exported in your shell

## Run

```bash
cd tools/moji-mash-studio
npm install
cp .env.example .env
# Edit .env — paste in your ANTHROPIC_API_KEY
npm run dev
# Open http://localhost:5737
```

Or, from the repo root: `npm run studio` (uses whatever key is in `tools/moji-mash-studio/.env`).

You only need to set up `.env` once. After that, `npm run dev` is all you need.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Required. Used for the chat agent and the existing `--check` vision pipeline. |
| `MOJI_STUDIO_PORT` | `5737` | Port for the local server. |
| `MOJI_STUDIO_PYTHON` | `python3` | Python interpreter used to invoke `scripts/generate_moji.py`. |

## How it works

- **System prompt**: read once at startup from `.claude/agents/moji-mash-editor.md`
  with frontmatter stripped. Single source of truth — edits to that file take
  effect on the next server restart.
- **Tools registered with Claude**: `read_file`, `list_pool`, `generate_moji`,
  `promote_moji`. The first two are pure TypeScript; the latter two shell out
  to `python scripts/generate_moji.py` from the repo root and stream progress
  back to the browser via SSE.
- **Gallery**: each `generate_moji` call appends a concept card with three
  variants, composite scores from the existing two-pass vision check, and a
  gold border on the recommended variant. Click "Promote this" to inject a
  message into the chat asking the agent to call `promote_moji` for that file.
- **State**: all in memory. Refresh re-hydrates from `/api/messages` and
  `/api/concepts`. Restarting the server resets everything.

## Limits

- Single user, single session.
- `MAX_AGENT_ITERATIONS = 12` (max tool-use turns per user message).
- `MAX_GENERATIONS_PER_TURN = 3` (the agent can't burn an hour of GPU time on
  one user message; further `generate_moji` calls return an error asking it
  to check in with the user first).
- The contact-sheet HTML parser at
  `src/server/tools/contactSheetParser.ts` is coupled to
  `_build_contact_sheet()` in `scripts/generate_moji.py`. If that Python
  function changes shape, update the parser too.

## Troubleshooting

- **Health dot is red for Apple Silicon** — you're not on arm64 macOS. Image
  generation can't run; brainstorming still works but `generate_moji` will
  fail fast.
- **Health dot is red for open-genmoji** — clone it: `git clone https://github.com/EvanZhouDev/open-genmoji ~/tools/open-genmoji` and
  follow the setup in `docs/moji-mash-style-guide.md`.
- **Chat hangs forever** — check the server terminal for Python stderr;
  `mflux` errors propagate as tool results back to the agent.
- **Wrong Python** — set `MOJI_STUDIO_PYTHON=/path/to/python3.11` in the
  shell where you run `npm run dev`.
- **Boot warning `Cannot find base config file "expo/tsconfig.base"`** — only
  appears if you run the studio in a checkout where the root expo deps haven't
  been installed yet. Run `npm install` at the gameshow repo root once and the
  warning goes away. Non-fatal — the studio still boots and works.
