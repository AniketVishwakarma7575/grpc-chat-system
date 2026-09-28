#!/usr/bin/env node
// goey-toast CLI — install the agent skill into a project so coding agents
// (Claude Code, Cursor, etc.) know how to install and use goey-toast.
//
// Usage:
//   npx goey-toast add-skill            # -> ./.claude/skills/goey-toast/SKILL.md
//   npx goey-toast add-skill --agents   # also write ./AGENTS.md pointer
//   npx goey-toast add-skill --dir .codex/skills
//   npx goey-toast print-skill          # print SKILL.md to stdout

import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import {
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_SRC = resolve(__dirname, '..', 'skills', 'goey-toast', 'SKILL.md')

const argv = process.argv.slice(2)
const cmd = argv[0]

function getFlag(name) {
  const i = argv.indexOf(`--${name}`)
  if (i === -1) return undefined
  const next = argv[i + 1]
  return next && !next.startsWith('--') ? next : true
}

function readSkill() {
  if (!existsSync(SKILL_SRC)) {
    console.error(`goey-toast: skill source not found at ${SKILL_SRC}`)
    process.exit(1)
  }
  return readFileSync(SKILL_SRC, 'utf8')
}

function addSkill() {
  const dir = typeof getFlag('dir') === 'string'
    ? getFlag('dir')
    : '.claude/skills/goey-toast'
  const dest = resolve(process.cwd(), dir)
  mkdirSync(dest, { recursive: true })
  const out = join(dest, 'SKILL.md')
  copyFileSync(SKILL_SRC, out)
  console.log(`✓ goey-toast skill installed: ${out}`)

  if (getFlag('agents')) {
    const agentsPath = resolve(process.cwd(), 'AGENTS.md')
    const pointer =
      '\n## goey-toast\n\n' +
      `See \`${dir}/SKILL.md\` for how to install and use goey-toast ` +
      '(gooey morphing React toasts). Mount `<GooeyToaster />` once and ' +
      "import `'goey-toast/styles.css'` at the app entry.\n"
    if (existsSync(agentsPath)) {
      const cur = readFileSync(agentsPath, 'utf8')
      if (!cur.includes('## goey-toast')) {
        writeFileSync(agentsPath, cur.trimEnd() + '\n' + pointer)
        console.log(`✓ appended goey-toast pointer to ${agentsPath}`)
      } else {
        console.log('• AGENTS.md already references goey-toast — skipped')
      }
    } else {
      writeFileSync(agentsPath, '# AGENTS.md\n' + pointer)
      console.log(`✓ created ${agentsPath}`)
    }
  }

  console.log('\nNext: restart your agent so it picks up the new skill.')
}

function help() {
  console.log(`goey-toast CLI

Commands:
  add-skill              Install the agent skill into ./.claude/skills/goey-toast
    --dir <path>         Custom target dir (e.g. .codex/skills, .cursor/skills)
    --agents             Also add/append an AGENTS.md pointer
  print-skill            Print SKILL.md to stdout
  help                   Show this help

Examples:
  npx goey-toast add-skill
  npx goey-toast add-skill --agents
  npx goey-toast add-skill --dir .cursor/skills/goey-toast
`)
}

switch (cmd) {
  case 'add-skill':
    addSkill()
    break
  case 'print-skill':
    process.stdout.write(readSkill())
    break
  case undefined:
  case 'help':
  case '--help':
  case '-h':
    help()
    break
  default:
    console.error(`goey-toast: unknown command "${cmd}"\n`)
    help()
    process.exit(1)
}
