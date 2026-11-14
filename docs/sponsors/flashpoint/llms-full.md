<!-- Source: https://docs.flashpoint.ai/llms-full.txt, downloaded 2026-11-14 10:58 AM CT. Reference only. -->
# Introduction

Flashpoint.AI is a research platform you operate through chat. You describe a research objective in natural language. The platform plans the work, recruits respondents, fields the survey, analyzes the data, and returns the artifacts.

Two principles shape everything in these docs: the platform is **open**, and the research it produces is **rigorous**.

## Open by design

No part of the platform is walled off:

- **Open to humans and agents.** The chat UI, the MCP server, and the REST API expose the same capabilities. An autonomous agent can run a complete study end to end.
- **Open to your tools.** Plug third-party tools in over MCP and the API — or pull Flashpoint.AI capabilities into your own product.
- **Open on the way out.** Export surveys to Qualtrics, Confirmit, and Forsta; export data to CSV and XLSX. Your work stays portable.
- **Open pricing.** Usage-based and transparent. Agents pay per call over x402.
- **Open to any audience.** Market Experiments measure real behavior from people who will never take a survey — research is not limited to panels.

## Rigorous by default

AI makes research fast. The platform's job is to keep it sound. Structure is enforced, not suggested:

- **SurveyCheck walks every path** before a survey fields. It proves each quota cell is reachable, surfaces unanswerable questions, and gates publishing on an unacknowledged failing check.
- **Data quality is screened on every response.** Research Defender and ReDem validate paid sample. Speeder and straight-liner detection runs on every survey. ReCaptcha blocks bots.
- **Synthetic sample is measured, not assumed.** Every synthetic panel carries a Fit Score against its target population, and calibrations are validated with k-fold testing.
- **Analysis is statistical.** Crosstabs carry significance tests. Surveys are versioned. Every failure mode has a documented error code.

If your agent runs research here, it inherits this structure. The same checks gate an agent's study and a human's — speed without slop.

## Three ways in

| Surface | Who it's for | Where |
|---|---|---|
| **Chat UI** | Researchers, PMs, marketers — humans doing studies | [app.flashpoint.ai](https://app.flashpoint.ai) |
| **MCP server** | Autonomous agents that pay per call (USDC over [x402](https://www.x402.org)) and humans driving Flashpoint.AI from Claude Desktop | `https://api.flashpoint.ai/mcp` |
| **REST API** | Server-side integrations and back-office automation against the surveys service | See [API Reference](/api-reference) |

The chat UI, the MCP server, and the REST API share the same domain model and the same data. You can start a study in chat and analyze it through the API, or have an agent run a panel and review the results in the UI.

## What it covers

- **Surveys** — design with 20+ question types, skip logic, quotas, templates; lifecycle from draft to complete with versioning. [Read more](/surveys).
- **Sample** — AI-generated synthetic respondents, or real panels from Prolific and Dynata. Each source tagged for per-panel analysis. [Read more](/synthetic).
- **Distribute** — public links, tracked email lists, panel-provider recruitment. [Read more](/surveys-distribute).
- **Analyze** — frequencies, crosstabs, NPS, chi-square, segment filters, AI-powered insights. [Read more](/surveys-analyze).
- **Deliver** — DOCX import, CSV / XLSX / Qualtrics / Confirmit / Forsta exports, presentation generation. [Read more](/surveys-import-export).

## Design principles

1. **Chat is the primary surface.** Every action available in the API is also available through chat. The agent plans multi-step workflows, reports progress as it works, and requests approval before destructive actions.
2. **All channels share one model.** A survey written through chat, the MCP tool, or the REST API reads back identically through any of them.
3. **Real and synthetic respondents share a schema.** Responses are tagged by source, so you can analyze them together or separately.
4. **Errors are predictable.** Every failure mode has a documented code and an HTTP status. See [Errors](/errors).

## For agents

Every page in these docs is available as raw markdown. Replace the path prefix with `/raw` to fetch the source:

```
GET https://docs.flashpoint.ai/quickstart       → rendered HTML
GET https://docs.flashpoint.ai/raw/quickstart   → raw markdown (text/markdown)
```

Or click **View as markdown** at the top of any page.

## What's here

- **[Quickstart](/quickstart)** — first tool call in under five minutes
- **[Connect from your AI assistant](/connect-mcp)** — per-client setup for Claude Desktop, Claude.ai web, Claude Code, and ChatGPT
- **[Authentication](/authentication)** — three auth flavors: chat UI (Auth0), MCP for autonomous agents (wallet JWT), MCP for humans (OAuth via Claude Desktop)
- **[API Reference](/api-reference)** — every MCP tool, every request and response
- **[MCP capability reference](/mcp-capabilities)** — all ~150 things the surveys agent can do over MCP, what it cannot, and the limits
- **[Errors](/errors)** — error codes and how to recover

## Conventions

- Code samples default to `curl`. Tabs for language alternatives are coming.
- Field names in prose are wrapped in backticks: `team_id`, `Authorization`.
- Required parameters are flagged inline. Optional parameters note their default.


---

# Quickstart

Run your first Flashpoint.AI tool call from your AI assistant in under five minutes. Works with Claude Desktop, Claude.ai web, Claude Code, ChatGPT custom connectors, and other MCP-compatible clients (Cursor, Cline, Continue, custom).

## 1. Add the Flashpoint.AI MCP server

Paste this URL into your assistant's MCP / custom-connector settings:

```
https://api.flashpoint.ai/mcp
```

For Claude Code (CLI), use:

```bash
claude mcp add --transport http flashpoint https://api.flashpoint.ai/mcp
```

The `--transport http` flag is required for the CLI path — without it the CLI assumes stdio and treats the URL as a subprocess command.

Per-client steps (Desktop, web, Code, ChatGPT) live in [Connect from your AI assistant](/connect-mcp).

## 2. Sign in

The first time you call a Flashpoint.AI tool, Claude opens your browser to Flashpoint.AI's Auth0 login. After you sign in:

1. Flashpoint.AI loads the teams you belong to.
2. A **team picker** page asks which team this Claude session should act as.
3. Click the team. Claude receives an access token bound to your `user_id` + `team_id` for 24 hours and registers the connection.

The token is scoped to the team you picked. To switch teams, re-run the connection from Claude.

## 3. Try a tool

Ask Claude:

> "Use Flashpoint.AI to get demographics for San Francisco."

Claude calls the `demographics` MCP tool. You get back population, age, race, gender, education, and income distributions with AI-powered insights — sourced from US Census Bureau data for US locations, international city profiles otherwise.

Other tools you can try:

| Ask Claude | Tool called | What you get |
|---|---|---|
| "Build me a 10-question NPS survey for SaaS buyers" | `tool_survey` | A draft survey via the surveys agent |
| "Add a quota of 50% women, translate it to Spanish, and run surveycheck" | `tool_survey` | Quotas, a second language, and a logic-prover report on the same survey |
| "Recruit 50 Prolific respondents for it — quote first" | `tool_survey` | A price quote, then on your confirmation a secure checkout link |
| "Show me the crosstab of satisfaction by age and export to XLSX" | `tool_survey` | Analysis plus a download |
| "Create 50 synthetic marketing managers and run them through that survey" | `panel` | AI personas answer per their demographic profile |
| "Build a deck from the results" | `presentation` | Native `.pptx` with editable charts |
| "Plan a multi-step study about Gen Z banking habits" | `chat` | Full orchestrator — plans, executes, narrates |

Anything about a survey goes to `tool_survey`; the full capability list is in the [API Reference](/api-reference#tool_survey).

## What you just used

- **`https://api.flashpoint.ai/mcp`** — the Flashpoint.AI MCP server, speaking the [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http). Claude discovers our OAuth flow via the [standard well-known endpoints](https://www.rfc-editor.org/rfc/rfc8414); see [Authentication](/authentication) for the details.
- **Your access token** is an HS256 JWT issued by mcp-server, bound to `(user_id, team_id)`, 24-hour expiry. Stored locally by Claude — never copy-pasted, never visible to you.
- **Per-call billing for human users is bundled** with your Flashpoint.AI subscription. Autonomous wallet agents pay per call in USDC over [x402](https://www.x402.org) — see [Authentication › Wallet JWT](/authentication#wallet-jwt-autonomous-agents).

## Next steps

- Read [Authentication](/authentication) for the three auth flavors and when to use which
- Browse every tool with parameters and return shapes in the [API Reference](/api-reference)
- For survey design, panels, and analysis, jump to [Surveys](/surveys)
- Map error codes to recovery in [Errors](/errors)


---

# Connect from your AI assistant

Plug Flashpoint.AI into Claude or ChatGPT and sign in with your normal Flashpoint.AI account — no API keys or tokens to copy. Usage is covered by your Flashpoint.AI subscription.

**Server URL:** `https://api.flashpoint.ai/mcp`

For the protocol details (OAuth 2.1, JWT shape, RFC references), see [Authentication](/authentication). For your first tool call walkthrough, see [Quickstart](/quickstart).

## Claude Desktop

1. Open **Settings → Connectors**.
2. Click **Add custom connector**.
3. Paste the server URL: `https://api.flashpoint.ai/mcp`
4. Click **Add**, then **Connect**.
5. A browser window opens — log in with your Flashpoint.AI account.
6. Pick the **team** you want this connection to use.

Done — Flashpoint.AI tools now show up in Claude.

## Claude.ai (web)

1. Go to **Settings → Connectors** on [claude.ai](https://claude.ai).
2. Click **Add custom connector**.
3. Paste the server URL: `https://api.flashpoint.ai/mcp`
4. Click **Connect**, log in with your Flashpoint.AI account, and pick a team.

## Claude Code (CLI)

```bash
claude mcp add --transport http flashpoint https://api.flashpoint.ai/mcp
```

The first time you use a Flashpoint.AI tool, a browser window opens to log in and pick your team.

## ChatGPT (custom connector)

1. In ChatGPT, open **Settings → Connectors → Add custom connector**.
2. Paste the server URL: `https://api.flashpoint.ai/mcp`
3. Click **Connect**, log in with your Flashpoint.AI account, and pick a team.

## What you can do once connected

- **Surveys, end to end** — plan, design (20+ question types, logic, quotas, translations), QA with the logic prover, publish, recruit paid respondents from Prolific / Dynata / Cint, distribute by email, analyze (crosstabs, NPS, conjoint simulator) and export. All of it through one tool, `tool_survey`.
- **Synthetic respondents** — build a persona panel and run it through a survey (`panel`).
- **Demographics** for any place (`demographics`) and native PowerPoint decks (`presentation`).
- **Everything else the Flashpoint.AI orchestrator does** — ad experiments, research scoping, team files, maps — through `chat`.

Money and destructive actions (publishing, deleting, sending email, paying for sample) always ask you to confirm on a second message before anything happens. Interactive cards such as the results dashboard, conjoint simulator, and checkout open in the web app; every conversation you have over MCP also shows up at [app.flashpoint.ai](https://app.flashpoint.ai).

The full tool list with parameters is in the [API Reference](/api-reference), and every capability of the surveys agent, tool by tool, is in the [MCP capability reference](/mcp-capabilities).

## How sign-in works

When you click **Connect**, your assistant kicks off an OAuth 2.1 flow:

1. Your assistant registers itself with the Flashpoint.AI MCP server.
2. Your browser opens at `auth.flashpoint.ai` — log in with your normal Flashpoint.AI credentials.
3. You see a **team picker** — pick which team this connection should act as. Tools you call will read and write data for that team.
4. Your assistant receives a session token bound to `(your user, that team)` with a 24-hour expiry.

The session refreshes automatically. You can connect more than one assistant at the same time — each gets its own session. To switch the team a connection acts as, remove the connector and add it again — you'll get the team picker on the next sign-in.

If you're building an autonomous agent (no human in the loop) rather than connecting an assistant for a person, use the [Wallet JWT flow](/authentication#mcp-wallet-jwt-autonomous-agents) instead.

## Troubleshooting

**"Couldn't connect" before a browser opens.** Make sure you pasted the URL exactly: `https://api.flashpoint.ai/mcp` — including the `/mcp` suffix.

**Login page errors.** Close the browser tab and start the connection again from your assistant. If you see "callback URL mismatch" repeatedly, contact support — that's a server-side config issue.

**Tool calls fail after connecting.** Disconnect the connector in your assistant's settings and re-add it — that forces a fresh login. If it still fails, include the client (Desktop / web / Code / ChatGPT), the team you picked, and the time of the failed call when you report it.

**"Unauthorized" mid-session.** Your session expired and the assistant didn't refresh it. Reconnect once.


---

# MCP capability reference

Everything an AI assistant connected to Flashpoint.AI over MCP can do, tool by tool. This page is generated from the live tool registry, so if a capability is not listed here the assistant cannot do it yet.

The MCP server exposes six tools of its own — `tool_survey`, `panel`, `demographics`, `presentation`, `payment_confirmation` and `chat` — documented with parameters in the [API Reference](/api-reference). The first of those, `tool_survey`, hands your brief to the **surveys agent**, which has the internal toolset below. You never call these inner tools by name: you describe what you want and the agent picks them. Names are listed so you can be precise ("run `surveycheck`", "give me `get_crosstab` of Q3 by Q7") and so you can tell what is and is not possible.

**Legend.** ⚠ marks an action the agent will not take on the first ask: it tells you what is about to happen and waits for a confirming message on the same `conversation_id` before doing it (publishing, deleting, sending email, spending money).

## What the surveys agent can do


### Plan

Before anything is built.

| Tool | What it does |
|---|---|
| `plan_survey` | Present a structured survey plan for user approval BEFORE building. |

### Research

Ground the questionnaire in real-world context.

| Tool | What it does |
|---|---|
| `attach_research_sources` | Persist research citations on a survey so they survive outside the chat. |
| `get_research_sources` | Read the research citations stored on a survey. |
| `research_audience` | Research a target audience — demographics, psychographics, behavior patterns, language preferences. |
| `research_competitors` | Research competitors in a given industry or product category. |
| `research_market` | Do a quick web research pass on a market or topic. |

### Templates

Start from one, or save one.

| Tool | What it does |
|---|---|
| `create_survey_from_template` | Create a new survey from a template. |
| `list_templates` | List available survey templates. |
| `save_survey_as_template` | Save a survey's current design as a reusable template. |

### Surveys

Create, read, update, lifecycle.

| Tool | What it does |
|---|---|
| `attach_survey` | Bring an EXISTING team survey into THIS chat as a reference so you can view or work on it here — use when the user points at a survey created in another chat ('pull up my Nike survey', 'work on the BNPL one'). |
| `clone_survey` | Create an exact copy of an existing survey as a new DRAFT. |
| `complete_survey` ⚠ | Mark a survey as COMPLETED — permanently closes response collection. |
| `create_survey` | Create a new empty survey in DRAFT status. |
| `delete_survey` ⚠ | Soft-delete a survey. |
| `get_survey` | Retrieve a survey with its full document (all blocks, questions, logic, settings). |
| `list_surveys` | List surveys — by default only the current user's, optionally the whole team's. |
| `pause_survey` ⚠ | Pause an ACTIVE survey — temporarily stops accepting responses. |
| `publish_survey` ⚠ | Publish a survey — transitions it from DRAFT or PAUSED to ACTIVE. |
| `set_redirect_urls` | Set the survey's exit redirect URLs — where respondents are sent after finishing, per terminal status (complete / disqualify / terminate / over_quota). |
| `set_url_variables` | Declare entry-link (URL) variables — Decipher's extraVariables. |
| `transfer_survey` ⚠ | Transfer OWNERSHIP of a survey to the current user (you become its owner). |
| `update_survey` | Update a survey's metadata (name, objective) and/or its full document. |

### Questions and blocks

Author and restructure the questionnaire.

| Tool | What it does |
|---|---|
| `add_block` | Add a new empty block (section) to a survey. |
| `add_question` | Add a question to a survey. |
| `change_question_type` | Convert an existing question to a different type in one atomic operation. |
| `clear_block_rotation` | Remove block rotation. |
| `create_answer_list` | Create a reusable Answer List — an option list defined once and referenced by many questions (agreement scales, brand lists, country lists). |
| `delete_answer_list` | Delete a reusable Answer List. |
| `delete_block` ⚠ | Delete a block (section) and ALL questions inside it. |
| `duplicate_block` | Duplicate a block and all its questions. |
| `get_question_type` | Everything about ONE question type: its config keys with defaults and allowed values, the keys that must NOT be used (and what replaced them), what logic can do with its answer, and a complete worked example of the question as stored. |
| `move_block` | Move a block (section) to a new position in the survey's block sequence. |
| `move_question` | Move ONE question into a block (optionally at a position inside it). |
| `remove_question` | Remove a question from a survey. |
| `rename_block` | Rename a block (section). |
| `rename_question` | Rename a question's label AND rewrite every reference to it across the survey in one atomic operation: display conditions, skip conditions, skip targets, variable definitions, and option piping (linked_options) are all updated together — nothing breaks. |
| `reorder_questions` | Reorder all questions in a survey. |
| `rotate_blocks` | Rotate (shuffle) BLOCK ORDER per respondent: the listed blocks form one rotation group and are shuffled per respondent, session-stable. |
| `update_answer_list` | Update a reusable Answer List's name and/or REPLACE its options. |
| `update_block` | Update a block's config: shuffle the questions inside it per respondent, or loop the block once per selected answer or list item. |
| `update_question` | Update an existing question's text, options, config, or logic. |

### Quotas

Targets, least-fill, sheets, progress.

| Tool | What it does |
|---|---|
| `add_quota` | Add a single quota without touching existing ones. |
| `delete_quota` ⚠ | Delete a single quota by ID. |
| `export_quota_report` | Generate a quota status report — quota targets, fill counts, fill percentages, basic analytics. |
| `get_quota_progress` | Get live quota progress — target vs actual fill for each quota, with fill percentages and remaining counts. |
| `reconcile_quotas` | Recount all quotas from actual response data and sync Redis. |
| `set_quotas` ⚠ | Replace ALL quotas for a survey. |
| `update_quota` | Update a single quota's name, target, soft floor, least-fill priority or SHEET. |

### Variables and keymaps

Entry-link variables and the team's coding keys.

| Tool | What it does |
|---|---|
| `get_variables_keymap` | Get the team's variable keymap — a dict mapping survey variable labels to custom coding keys used by the team's downstream systems. |
| `set_variables_keymap` | Merge key-value pairs into the team's variable keymap. |

### Languages and AI review

Translation and AI-assisted quality.

| Tool | What it does |
|---|---|
| `add_survey_language` | Make THIS survey multi-language: add a language as an in-place translation overlay (the survey stays ONE survey — respondents pick their language at the start; every question renders in it). |
| `analyze_open_ends` | AI analysis of open-ended (text) responses. |
| `optimize_survey` | AI quality review of a survey. |
| `set_translation` | Change ONE translated string on a multi-language survey — the way to act on a client's comment left while reading a translation (the comment carries `language`). |
| `summarize_results` | AI key takeaways for a survey — structured topic clusters with evidence, suitable for the FE 'AI Insights' panel. |
| `translate_survey` | Translate a survey into another language. |

### Validation

What would stop a publish.

| Tool | What it does |
|---|---|
| `publish_readiness` | What would stop publish_survey right now, in the gate's own words: blockers (cannot publish), errors and publish-readiness items (need the user's explicit acknowledgement: no QA run on this revision, no quotas, placeholder wording). |
| `surveycheck` | Validate a survey before publishing. |
| `validate_dsl` | Parse a DSL expression and report whether it is syntactically valid. |

### QA and field checks

QA rounds, path walks, field reports, client review.

| Tool | What it does |
|---|---|
| `get_field_report` | The field report for a live or finished survey — real respondents replayed through the flow proof. |
| `list_qa_findings` | The QA ROUND ledger — only what a recorded QA round or a reviewer filed. |
| `qa_overview` | One call for 'what's the fielding status?' and 'what's open in QA?'. |
| `run_qa_round` | Start a QA round (the same as Run QA in the builder's QA tab) on the version being edited and wait for it. |
| `send_review_link` | Create a client review link and email it. |
| `update_qa_finding` | Update one or more QA findings in the ledger: status (open / accepted / fixed / dismissed), assignee, note. |
| `walk_survey_path` | Walk one path through the survey exactly as the runner would and explain every decision: which questions each page shows and hides (with the condition and its result), the answers given, variables assigned, the skip that fired and where the path ends. |

### Versions

Pending vs live versions.

| Tool | What it does |
|---|---|
| `compare_versions` | Compare two versions of a survey — shows what questions were added, removed, or modified between them. |
| `get_version` | Load a specific version of a survey document. |
| `list_versions` | List all versions of a survey — version number, who changed it, when, and a summary of changes. |
| `push_version` ⚠ | Push a pending version live — respondents will now see this version. |
| `restore_version` ⚠ | Restore a previous version of the survey document. |

### Edit history and undo

Who changed what, and undo it.

| Tool | What it does |
|---|---|
| `survey_history` | Recent EDIT history for a survey — who changed what, when, and from where (chat vs the builder). |
| `undo_survey_change` ⚠ | Undo a previous edit to a survey — including edits made in the builder, not just your own. |

### Paid sample (Prolific, Dynata, Cint)

Quote, pay, launch, monitor.

| Tool | What it does |
|---|---|
| `get_attribute_options` | Drill into the options of a SINGLE panel attribute. |
| `list_panel_filters` | List every targeting filter a panel provider supports — the keys you can put under `targeting` in panel_quote, plus the canonical values each key accepts. |
| `list_panel_integrations` | List every panel-vendor integration on a survey — each Prolific, Dynata or Cint buy with its status. |
| `list_panel_markets` | Which countries a provider fields in, and IN WHICH LANGUAGES. |
| `list_panel_providers` | List the panel providers available on this platform (currently Prolific, Dynata, and Cint). |
| `panel_pause` ⚠ | Pause an active panel — stops sending new respondents to the survey but doesn't refund or close the vendor project. |
| `panel_quote` | Get a price + feasibility quote from a panel provider WITHOUT committing money. |
| `panel_resume` ⚠ | Resume a paused panel — vendor starts sending respondents again. |
| `panel_status` | Get LIVE status from the panel provider — completes so far, starts, in-progress, disqualified, over-quota counts. |
| `request_panel_payment` ⚠ | Collect payment for launching a panel buy, then launch it once the user pays. |
| `search_panel_attributes` | Search the vendor's FULL attribute catalog for non-standard targeting. |

### Distribution: email, your own panels, sample sources

Email lists, first-party panels, BYO panel vendors.

| Tool | What it does |
|---|---|
| `add_panel_members` | Add people to an existing panel. |
| `add_recipients_to_email_list` | Append new recipients to an existing email list. |
| `attach_panel_to_survey` | Attach a panel to a survey, so it becomes part of the project rather than a one-off send. |
| `attach_sample_source` | Attach a library sample source to a survey — COPIES the source's redirects onto the survey's runtime settings and returns the entry link fragment (?fp_src=<id>&rid=) the partner appends to the survey's public URL. |
| `compose_email_template` | Draft (or rewrite) a survey-invitation email using AI. |
| `create_custom_panel` | Create a reusable custom panel — a saved list of email addresses that can be used across multiple surveys. |
| `create_email_list` | Create an email distribution list for a survey. |
| `create_first_party_panel` | Create a panel from people the user listed in the conversation. |
| `create_sample_source` | Save a BYO sample partner (external panel company) to the team library: name + per-status exit-redirect URL templates (complete / disqualify / terminate / over_quota / bad_quality) + any extra entry params. |
| `delete_sample_source` ⚠ | Delete a sample source from the team library. |
| `detach_panel_from_survey` | Remove a panel from a survey. |
| `detach_sample_source` ⚠ | Remove an attached sample source from a survey. |
| `get_email_list_stats` | Get delivery and response statistics for an email list — how many sent, opened, started, completed, bounced. |
| `get_panel_send_report` | How a panel send is doing: sent, started, completed, bounced. |
| `list_custom_panels` | List all custom panels for the current team. |
| `list_first_party_panels` | List the team's OWN panels — contact lists they uploaded themselves, as opposed to synthetic personas or a vendor buy. |
| `list_sample_sources` | List the team's saved sample sources (BYO panel companies: name + per-status exit redirects + entry params). |
| `preview_panel_audience` | Count who would actually be emailed, WITHOUT sending anything. |
| `resend_email_list` ⚠ | Resend an email campaign to recipients who haven't completed yet. |
| `send_email_list` ⚠ | Trigger sending of an email list — delivers survey invitations to all recipients in the list. |
| `send_platform_email` ⚠ | Email platform-generated files (surveys, reports, response exports) to up to 10 recipients. |
| `send_survey_to_panel` ⚠ | Email a survey invitation to everyone on a first-party panel. |
| `update_sample_source` | Update a library sample source (name / redirects / entry params / notes). |

### Data quality

Fraud screening and response hygiene.

| Tool | What it does |
|---|---|
| `detect_speeders` | Find responses that were completed suspiciously fast. |
| `detect_straightliners` | Find responses where the respondent gave the SAME answer to every row in grid questions. |
| `generate_test_data` | Generate JUNK fake responses for a survey — randomised answers with NO connection to any persona, panel, or research design. |
| `get_quality_summary` | The fraud and data-quality summary for a survey: how many entrants Research Defender screened, blocked (with the top reasons) or flagged, and how ReDem scored the completes. |
| `set_data_validation` | Turn the paid data-validation tools on/off for a survey: Research Defender (pre-survey fraud/bot/duplicate screening, billed per check) and ReDem (post-survey response-quality scoring, billed per complete). |

### Analysis, conjoint, and exports

Frequencies, crosstabs, NPS, conjoint simulator, files.

| Tool | What it does |
|---|---|
| `conjoint_interaction_test` | Test whether pairs of attributes interact (for example brand × price) rather than acting independently. |
| `conjoint_optimize_product` | Find the best product to launch: every combination of levels scored against the competitors, ranked by share or by revenue (share × price, when the design has a price attribute). |
| `conjoint_segments` | Segment the respondents by what they want. |
| `conjoint_sensitivity` | Sensitivity analysis: one product with each level of each attribute swapped in turn, against the competitors — how its share moves with price, brand, etc. |
| `conjoint_willingness_to_pay` | Willingness to pay for each level of each non-price attribute, in the price attribute's units: the median premium respondents would pay over the attribute's least-preferred level. |
| `create_conjoint_share_link` | Create a no-login link a client can open the conjoint simulator with — one question, one audience, shares computed on our side, response rows never leave. |
| `exclude_response` ⚠ | Exclude (or re-include) a response from analytics. |
| `explain_conjoint_methods` | What the conjoint simulator computes and how: the estimation (HB), the fit diagnostics and the convergence policy, the reporting scales, the share rules, the none option, every analysis, the design report, the outputs, and how it compares with Sawtooth. |
| `export_csv` | Export survey response data as CSV. |
| `export_docx` | Export the survey INSTRUMENT (questions, options, logic) as a Word document (.docx). |
| `export_pdf` | Export the survey INSTRUMENT (questions, options, logic) as a PDF document. |
| `export_xlsx` | Export survey response data as an Excel workbook (.xlsx): a Data sheet with the wide two-row header, a labeled sheet, and a Questions codebook sheet. |
| `generate_csv` | Generate a CSV file from agent-composed rows and return a presigned download URL (valid 1 hour). |
| `generate_docx` | Generate a Word document (.docx) from agent-composed content and return a presigned download URL (valid 1 hour). |
| `generate_pdf` | Generate a PDF document from agent-composed content and return a presigned download URL (valid 1 hour). |
| `generate_xlsx` | Generate an Excel workbook (.xlsx) from agent-composed content and return a presigned download URL (valid 1 hour). |
| `get_all_frequencies` | Get answer distributions for ALL questions in the survey at once. |
| `get_analytics` | Get a summary of survey response data: total responses, completion rate, median time, status breakdown, daily timeline (last 30 days), and country breakdown. |
| `get_crosstab` | Two-dimensional cross-tabulation: rows = one question's answers, columns = another question's answers, cells = count. |
| `get_frequencies` | Get the answer distribution for a single question — how many people picked each option, with counts and percentages. |
| `get_nps` | Calculate the Net Promoter Score for an NPS question. |
| `get_response` | Get the full detail of a single response — every answer, timestamps, geo, panel info and the order in which blocks, questions and options were shown to that respondent. |
| `list_conjoint_scenarios` | The scenarios saved on a conjoint simulator card, with the shares they scored when saved. |
| `list_responses` | List individual responses for a survey — paginated, filterable by status. |
| `save_conjoint_scenario` | Save the CONJOINT SIMULATOR scenario just discussed (products, rule, none-of-these set-up, filters) under a name — 'save this as …', 'remember this set-up', 'keep this scenario' after a simulation. |
| `show_conjoint_simulator_card` | Open the conjoint simulator for a conjoint question, as a card in the chat. |
| `show_results_card` | Put a survey's live results dashboard into the chat as a card, scoped to ONE audience bucket. |
| `simulate_conjoint_market` | Run the conjoint simulator: give it products as attribute -> level text and get each one's share of preference (optionally with a 95% interval), under a share rule, with or without a none-of-these alternative, for all respondents or a filtered segment. |
| `stat_test` | Run a chi-square test of independence on a cross-tabulation. |

### Comments

Review threads on a survey.

| Tool | What it does |
|---|---|
| `add_comment` | Add a comment to a survey — optionally on a specific question. |
| `list_comments` | List all comments on a survey — shows text, who posted, which question (if any), and whether it's resolved. |
| `resolve_comment` | Mark a comment as resolved — indicates the feedback has been addressed. |

### Programming preferences

How this team likes surveys built.

| Tool | What it does |
|---|---|
| `get_programming_preferences` | Read how this team programs surveys — the conventions they have agreed and accepted, including the markers their documents use and the exact strings those become. |
| `remember_programming_preference` | File something the user told you about how they want surveys programmed, so it is applied next time. |

That is 146 tools. The agent chains them itself: "build a 12-question NPS survey with an age quota, translate it to Spanish, check it, and publish" is one brief, not five calls.

## What the other MCP tools do

| Tool | Capability |
|---|---|
| `panel` | Build a synthetic panel of AI personas (up to 200), run a fresh panel through a survey in one call, or recruit real paid respondents through the surveys agent's quote → confirm → checkout flow. |
| `demographics` | Population, age, race, gender, education and income distributions for any place, with AI insights. |
| `presentation` | A native PowerPoint deck with editable charts from any data or analysis. |
| `payment_confirmation` | Settle an x402 USDC payment for a panel launch. Autonomous wallet agents only; humans pay through a Stripe Checkout link. |
| `chat` | The full orchestrator. Use it for multi-domain plans and for the capabilities that have no direct tool: ad and market experiments on Google, Meta and LinkedIn Ads (build variants, test them on synthetic personas, launch, analyze), research scoping and Statement of Work drafting, asking an existing synthetic panel a question, listing or calibrating the team's panels, the team file library, and maps of places or regions. |

## What is deliberately not available over MCP

Some things need a browser, a file upload, or are internal to the agent. Knowing this up front saves a round trip.

| Not over MCP | Do this instead |
|---|---|
| Uploading a spreadsheet of contacts or a questionnaire document (DOCX import) | Console → My Panels for contacts; Console → Import for a questionnaire. The agent cannot read files from a chat. |
| Interactive cards: plan review, approval card, results dashboard, conjoint simulator, Stripe payment panel | The agent describes the same content in text. The cards render in the web app, and every MCP conversation is visible at [app.flashpoint.ai](https://app.flashpoint.ai). Paid recruitment returns a Stripe Checkout link to open in a browser. |
| Qualtrics, Confirmit and Forsta export formats | Console → Export, or the surveys REST API. CSV / XLSX / DOCX / PDF are available through the agent. |
| Running an existing synthetic panel by id through `panel` | `panel(action="create_and_run")`, or ask `chat` to run the panel by id. |
| Two tools the agent uses internally (`redirect_to_orchestrator`, `report_unsupported_request`) | Nothing to do: the first hands non-survey requests to the orchestrator, the second files a feature request with engineering when something genuinely cannot be done. |

## Limits that apply over MCP

| Limit | Value |
|---|---|
| Email invitations + reminders per team per week | 100, resets Monday 00:00 UTC; raised per team on request to [help@flashpoint.ai](mailto:help@flashpoint.ai) |
| Email sends per conversation per survey | 50 |
| Synthetic panel size | 200 personas |
| `tool_survey` call duration | up to 600 s; long jobs stream progress notifications |
| Wallet agents | per-call USDC pricing, see [API Reference › Pricing](/api-reference#pricing-wallet-agents) |

See [Email distribution › Sending limits](/distribute-email#sending-limits) for how the email budget behaves and what a refused send looks like.


---

# Surveys

Flashpoint.AI runs survey research end to end from a natural language objective: design, recruit, field, analyze, and deliver. The same interface serves human researchers and autonomous agents.

## What it does

You supply a research objective in natural language. Any language is supported. The platform plans a multi-step workflow, executes the steps, and returns the artifacts: the questionnaire, the recruited panel, the response data, the analysis, and the deck.

## How it works

An objective is decomposed into a typed plan. Steps execute in dependency order. Some run immediately, such as questionnaire design; others are queued, such as synthetic fielding and deck generation. Outputs from one step are passed to later steps by reference, so a panel created in step one is consumed by step two using its real ID. Artifacts are returned as steps complete. Destructive actions, such as publishing, sending an email blast, or excluding responses, require explicit approval before they run.

## Two ways to use it

| Path | When to use |
|---|---|
| **Ask the agent** | Open a chat, describe what you want. The agent plans, executes, narrates, and asks for confirmation on anything destructive. Read [Ask the agent](/surveys-agent). |
| **Call the API** | Every action is available behind a REST endpoint, against the same model and data. Use it alongside the agent or on its own. Read the [API Reference](/api-reference). |

## Capabilities

| Area | What it covers | Read |
|---|---|---|
| **Build** | 20+ question types, blocks, skip logic, piping, randomization, translations, validation | [Build](/surveys-build) · [Question types](/question-types) · [Skip logic](/skip-logic) |
| **Quotas** | Total and conditional quotas with real-time enforcement, monitoring, reconciliation | [Quotas](/quotas) |
| **Lifecycle** | Draft, publish, pause, complete, clone — plus versioning that lets you edit a live survey without disturbing in-flight respondents | [Lifecycle](/surveys-lifecycle) |
| **Templates** | Pre-built survey designs by category; save any survey as a reusable template | [Templates](/templates) |
| **Sample** | AI-generated synthetic panels, Prolific, Dynata — with per-panel segmentation across the pipeline | [Sample](/synthetic) · [Synthetic](/sample-synthetic) · [Prolific](/sample-prolific) · [Dynata](/sample-dynata) |
| **Distribute** | Public link, email lists with tracking and resend, panel provider recruitment | [Distribute](/surveys-distribute) · [Email](/distribute-email) |
| **Analyze** | Frequencies, crosstabs, NPS, chi-square, segment filtering, AI-powered insights | [Analyze](/surveys-analyze) · [AI insights](/analyze-ai) · [Data quality](/data-quality) |
| **Import & export** | DOCX import (AI programs the survey), CSV, XLSX, PDF, Confirmit XML, Qualtrics QSF, Forsta XML | [Import & export](/surveys-import-export) |
| **Ask the agent** | Chat-driven everything with approval gates for destructive work | [Ask the agent](/surveys-agent) |

## Model

The core objects you'll see across the API and the chat artifacts:

- **`survey`** — the long-lived container. Has a name, a status (`draft` / `active` / `paused` / `completed`), and a `current_version` pointer at the live questionnaire.
- **`survey_version`** — an immutable snapshot of the questionnaire document at a point in time. Editing a published survey creates a new version; the live one keeps running until you push.
- **`response`** — a single respondent's answers. Always references the `survey_version` they took, so renaming Q4 next month doesn't rewrite history.
- **`panel`** — a source of respondents. Open links, email lists, synthetic personas, or external panel providers (Prolific, Dynata) each get a `panel_id` and you can segment analysis by it.
- **`workflow`** — a typed multi-step plan the agent generates from an objective. Each step has a tool, inputs, dependencies, and produces artifacts (the questionnaire, the deck, etc.).

## Conventions

- Every resource ID is a UUID. Routes are stable: `/api/v1/surveys/:id`.
- Destructive actions (publish, send, exclude, complete) emit approval-gated tool calls when invoked through the agent.
- All artifacts stream back over the chat connection while they're being produced, and persist to the chat history when they're done.

## Next steps

- New to the platform? Start at [Quickstart](/quickstart).
- Want to see what the agent can do? Read [Ask the agent](/surveys-agent).
- Run a study against an AI-generated panel: [Sample](/synthetic).
- Set up panel provider webhooks: [Webhooks](/webhooks).
- Handle data subject requests: [GDPR & privacy](/gdpr).
- Looking for a specific endpoint? Jump to the [API Reference](/api-reference).


---

# Build

Create surveys from scratch or iterate on existing ones. This page covers the document model, question and block operations, and the configuration surface area available through the API and the conversational agent.

## Document model

A survey contains an ordered list of **blocks**. Each block contains an ordered list of **questions**. Each question has a type, text, options (where applicable), configuration, and optional logic (skip rules and display conditions).

```
Survey
 └─ Block A ("Screener")
 │   ├─ Q1  select/single   "What is your age range?"
 │   └─ Q2  select/multi    "Which brands have you purchased?"
 └─ Block B ("Evaluation")
     ├─ Q3  grid            "Rate each brand on these attributes"
     ├─ Q4  text            "What else should we know?"
     └─ Q5  nps             "How likely are you to recommend us?"
```

The full document is stored as JSON in every survey version. Draft surveys have a single version; published surveys accumulate versions as edits are made (see [Lifecycle](/surveys-lifecycle)).

## Creating a survey

### REST API

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Brand Perception Study Q1 2026",
    "objective": "Understand how B2B SaaS buyers perceive our brand vs. competitors after the rebrand",
    "language": "en",
    "subtype": "online",
    "audience_description": "US adults 25-54 who have purchased SaaS products in the last 12 months",
    "sample_size": 500,
    "survey_time_minutes": 12
  }'
```

Response (`201 Created`):

```json
{
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "name": "Brand Perception Study Q1 2026",
  "objective": "Understand how B2B SaaS buyers perceive our brand vs. competitors after the rebrand",
  "status": "draft",
  "stage": "design",
  "language": "en",
  "subtype": "online",
  "current_version": 1,
  "revision": 1,
  "audience_description": "US adults 25-54 who have purchased SaaS products in the last 12 months",
  "sample_size": 500,
  "survey_time_minutes": 12,
  "published_at": null,
  "created_at": "2026-05-26T14:00:00Z",
  "created_by": "f0e1d2c3-b4a5-6789-0123-456789abcdef",
  "document": { "blocks": [] }
}
```

### Agent

> "Create a survey called Brand Perception Study Q1 2026 targeting US adults 25-54 who have purchased SaaS products in the last 12 months. The objective is to understand how B2B SaaS buyers perceive our brand vs. competitors after the rebrand."

The agent calls `create_survey` and returns the survey ID for subsequent operations.

## Adding questions

Questions are added one at a time via `add_question`. Each call appends the question to a target block (creating the block if it does not exist). Labels are auto-assigned (`Q1`, `Q2`, ...) unless you specify one.

For the complete list of question types and their configuration options, see [Question types](/question-types).

### Example: single-select with options

Via the API, add questions by including them in the document when calling `PATCH /api/v1/surveys/{id}`. Each question needs an `id`, `type`, `label`, `text`, `options`, and `config`. The server validates the document against the canonical schema on save.

The agent approach is simpler — it calls `add_question` with just the essentials and the server fills in IDs, labels, timestamps, and canonical field shapes:

> "Add a single-select question asking about the respondent's age range with options 18-24, 25-34, 35-44, 45-54, and 55+. Include a 'Prefer not to say' option. Put it in a block called Screener."

### Supported question types

| Type | Subtype | What it captures |
|------|---------|------------------|
| `select` | `single` | Pick one from a list |
| `select` | `multi` | Pick any number from a list |
| `text` | — | Free-form open response |
| `number` | — | Numeric input with optional min/max |
| `nps` | — | Net Promoter Score (0-10 scale) |
| `ranking` | — | Drag to rank options by preference |
| `grid` | (empty) | Matrix: one answer per row |
| `grid` | `multi` | Matrix: multiple answers per row |
| `maxdiff` | — | Best/worst scaling exercise |
| `conjoint` | — | Choice-based conjoint analysis |
| `van-westendorp` | — | Price sensitivity meter (four price points) |
| `currency` | — | Currency amount input |
| `percentage` | — | Single 0-100 percentage |
| `multi-percentage` | — | Multiple percentage inputs |
| `percent-sum` | — | Allocate percentages that must total 100 |
| `year` | — | Year input |
| `zipcode` | — | Postal code with locale-specific validation |
| `contact-form` | — | Structured contact fields (name, email, phone) |
| `ai-chat` | — | Conversational AI follow-up probe |
| `transition` | — | Display-only text between sections (no answer collected) |
| `terminate` | — | Ends the survey (for disqualification routing) |
| `variable` | — | Computed hidden field |

## Blocks

Blocks are the structural unit of a survey. They group related questions and control section-level behavior.

### Creating a block

The agent creates blocks on demand. If you call `add_question` with a `block_name` that does not exist, the block is created automatically. To create an empty block ahead of time:

> "Add a block called Demographics"

Via the API, blocks are part of the document. Add a new entry to the `blocks` array in a `PATCH /api/v1/surveys/{id}` call.

### Block configuration

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name shown to survey authors (not respondents) |
| `config.randomize` | boolean | Randomize question order within this block per respondent |
| `config.loop` | boolean | Repeat this block for each option selected in a source question |
| `config.loopSourceQuestionId` | string | UUID of the question whose selected options drive the loop |

### Block operations

| Operation | Agent command | What it does |
|-----------|---------------|--------------|
| Rename | "Rename the Demographics block to Background" | Changes the block's display name |
| Duplicate | "Duplicate the Screener block" | Deep-copies the block and all questions with new IDs and labels |
| Delete | "Delete the Evaluation block" | Removes the block and all its questions; cleans up skip logic references |

## Options configuration

Options on `select`, `ranking`, `grid`, and `maxdiff` questions support these configuration properties:

| Config field | Type | Effect |
|-------------|------|--------|
| `config.randomize` | boolean | Shuffle option order per respondent to reduce order bias |
| `config.ui` | string | Rendering mode: `radio` (default for single), `checkbox` (default for multi), `dropdown` |
| `config.minSelections` | integer | Minimum number of selections required (multi-select only) |
| `config.maxSelections` | integer | Maximum number of selections allowed (multi-select only) |
| `config.options.groups` | array | Option grouping for grouped randomization |

### Special option types

| `type` value | Behavior |
|-------------|----------|
| `user` | Standard option (default) |
| `nota` | "None of the above" — exclusive; clears other selections in multi-select |
| `other` | Write-in option with a text field |
| `dontknow` | "Don't know" escape option |
| `optout` | "Prefer not to say" |
| `notapplicable` | "Not applicable" |

### Opt-out

Questions can be configured with a top-level `optout` object to let respondents skip the question:

```json
{
  "optout": {
    "allowed": true,
    "text": "Prefer not to answer"
  }
}
```

## Reordering questions

To reorder questions, pass the complete list of question UUIDs in the desired order. Questions are redistributed proportionally across existing blocks.

> "Reorder the questions so Q3 comes before Q2"

Via the API, the agent uses the `reorder_questions` tool, which requires every question UUID in the survey:

```json
{
  "survey_id": "a1b2c3d4-...",
  "question_order": [
    "uuid-of-q1",
    "uuid-of-q3",
    "uuid-of-q2",
    "uuid-of-q4",
    "uuid-of-q5"
  ]
}
```

## Survey settings

Metadata fields can be updated independently of the document via `PATCH /api/v1/surveys/{id}`:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Survey display name |
| `objective` | string | Research objective (used by the agent for context) |
| `language` | string | ISO 639-1 language code (`en`, `es`, `fr`, `ja`, ...) |
| `subtype` | string | `online` or `phone` — affects export format and rendering |
| `audience_description` | string | Target audience description |
| `sample_size` | integer | Target number of complete responses |
| `survey_time_minutes` | integer | Expected completion time in minutes |
| `distribution_preference` | string | Default distribution method |
| `research_plan` | string | Free-form research plan text |
| `settings` | object | Additional key-value settings |

## Reading a survey

```bash
curl https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID \
  -H "Authorization: Bearer $TOKEN"
```

The response includes all metadata fields plus the full `document` from the latest version:

```json
{
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "name": "Brand Perception Study Q1 2026",
  "status": "draft",
  "current_version": 1,
  "revision": 3,
  "document": {
    "blocks": [
      {
        "id": "blk-001",
        "label": "A",
        "name": "Screener",
        "config": {},
        "questions": [
          {
            "id": "q-001",
            "type": "select",
            "subtype": "single",
            "label": "Q1",
            "text": "What is your age range?",
            "config": { "required": true, "ui": "radio" },
            "options": [
              { "id": "opt-1", "text": "18-24", "label": "1", "type": "user" },
              { "id": "opt-2", "text": "25-34", "label": "2", "type": "user" }
            ],
            "skips": []
          }
        ]
      }
    ]
  }
}
```

For published surveys with pending edits, `GET` returns the **latest** version (the working draft), while `current_version` in the metadata still points at the live version respondents see.

## Listing surveys

```bash
curl "https://api.flashpoint.ai/api/v1/surveys?status=draft&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "items": [
    {
      "id": "a1b2c3d4-...",
      "name": "Brand Perception Study Q1 2026",
      "status": "draft",
      "stage": "design",
      "created_by": "f0e1d2c3-...",
      "created_at": "2026-05-26T14:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

Filtering options: `status` (`draft`, `active`, `paused`, `completed`, `archived`), `workspace_id`, `limit` (1-200), `offset`.

## Pre-publish validation

Before publishing, run the spellcheck endpoint to catch broken logic references, invalid DSL expressions, and unreachable questions:

```bash
curl https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/spellcheck \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "unknown_identifiers": [],
  "invalid_dsls": [],
  "unreachable_questions": [],
  "post_logic_identifiers": []
}
```

An empty result means the survey is clean. Non-empty arrays describe specific issues — fix them before publishing.

## Next steps

- Take a draft live and manage versions: [Lifecycle & versioning](/surveys-lifecycle)
- Start from a pre-built design: [Templates](/templates)
- Hand the survey to respondents: [Distribute](/surveys-distribute)
- Import an existing survey from a Word doc: [Import & export](/surveys-import-export)


---

# Question types

Flashpoint.AI supports twenty-four question types, from simple single-select to choice-based conjoint and image-based stimuli. Each type maps to a structured answer schema so downstream analysis works without custom parsers.

Every question lives inside a **block** (section). When adding questions via the API or the agent, you specify the `type` string exactly as shown below.

---

## Choice questions

### select (single)

Single-select: respondent picks exactly one option from a list. Use for mutually exclusive choices like gender, purchase intent scales, or yes/no gates.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"select"` |
| `subtype` | yes | `"single"` |
| `text` | yes | Question prompt |
| `options` | yes | Array of options (min 2). Each: `{text, type?}` |
| `config.ui` | no | `"radio"` (default), `"dropdown"` |
| `config.randomize` | no | Shuffle option order per respondent |

```bash
curl -X PATCH https://api.flashpoint.ai/api/v1/surveys/{survey_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "blocks": [{
        "name": "Screener",
        "questions": [{
          "type": "select",
          "subtype": "single",
          "text": "How often do you purchase coffee?",
          "options": [
            {"text": "Daily"},
            {"text": "A few times a week"},
            {"text": "Weekly"},
            {"text": "Rarely"},
            {"text": "Never"}
          ]
        }]
      }]
    }
  }'
```

**Agent prompt:** "Add a single-select question asking how often they purchase coffee, with options Daily, A few times a week, Weekly, Rarely, Never"

### select (multi)

Multi-select: respondent picks one or more options. Use for "select all that apply" questions.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"select"` |
| `subtype` | yes | `"multi"` |
| `options` | yes | Array of options (min 2) |
| `config.maxSelections` | no | Cap on number of selections |
| `config.minSelections` | no | Minimum selections required |

Special option types: set `"type": "nota"` for "None of the above" (exclusive — clears other selections) or `"type": "other"` for a write-in field.

**Agent prompt:** "Add a multi-select asking which streaming services they use: Netflix, Hulu, Disney+, HBO Max, Amazon Prime Video, None of the above"

> **Picture-based choices?** When the options are images rather than text, use **image carousel** or **image hotspot** — see [Image questions](#image-questions).

---

## Open-ended questions

### text (single)

Single open-ended text input. Use for verbatim feedback, explanations, or follow-up probes.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"text"` |
| `subtype` | no | `"single"` (default) |
| `text` | yes | Question prompt |

No options are accepted. The respondent types a free-form answer.

**Agent prompt:** "Add an open-ended question asking what they liked most about the product"

### text (multi)

Multiple labeled text inputs in a single question. Use when you need several short answers grouped together (e.g., "List three words that describe this brand").

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"text"` |
| `subtype` | yes | `"multi"` |
| `config.inputs` | yes | Array of `{label, helper}` objects (min 1) |

```json
{
  "type": "text",
  "subtype": "multi",
  "text": "List three words that describe this brand.",
  "config": {
    "inputs": [
      {"label": "Word 1", "helper": "First word"},
      {"label": "Word 2", "helper": "Second word"},
      {"label": "Word 3", "helper": "Third word"}
    ]
  }
}
```

**Agent prompt:** "Add a multi-text question asking them to list three words that describe the brand"

### contact-form

Structured contact fields. Each input has a fixed label from the set: `firstname`, `lastname`, `phone`, `email`, `company`, `title`.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"contact-form"` |
| `config.inputs` | yes | Array of `{label, helper}` where label is one of the six field names |

**Agent prompt:** "Add a contact form collecting first name, last name, email, and company"

---

## Numeric questions

### number

General numeric input with optional range validation.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"number"` |
| `config.datarange` | no | `[min, max]` — use `null` for unbounded. Default: `[null, null]` |

**Agent prompt:** "Add a number question asking their household size, between 1 and 20"

### percentage

Percentage input, defaulting to a 0-100 range.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"percentage"` |
| `config.datarange` | no | Default: `[0, 100]` |

**Agent prompt:** "Ask what percentage of their commute is by car"

### year

Year input with a default minimum of 1900.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"year"` |
| `config.datarange` | no | Default: `[1900, null]` |

**Agent prompt:** "Ask what year they were born"

### currency

Currency amount input with an ISO 4217 currency code.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"currency"` |
| `config.currency` | no | 3-letter ISO code. Default: `"USD"` |

**Agent prompt:** "Ask how much they spent on groceries last week in USD"

### zipcode

Postal code input with country-specific validation.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"zipcode"` |
| `config.country` | no | 2-letter ISO 3166-1 alpha-2 code. Default: `"US"` |

**Agent prompt:** "Add a zipcode question for their home address"

---

## Allocation questions

### percent-sum

Respondent allocates percentages across items that must total 100. Use for budget allocation, time split, or preference distribution.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"percent-sum"` |
| `config.inputs` | yes | Array of `{label, helper}` (min 2). Each becomes a percentage input |

```json
{
  "type": "percent-sum",
  "text": "How do you split your work time across these activities?",
  "config": {
    "inputs": [
      {"label": "Meetings", "helper": "Meetings"},
      {"label": "Deep work", "helper": "Deep work"},
      {"label": "Email", "helper": "Email"},
      {"label": "Admin", "helper": "Admin"}
    ]
  }
}
```

**Agent prompt:** "Add a percent-sum question asking how they split their work time across Meetings, Deep work, Email, and Admin"

### multi-percentage

Multiple independent percentage inputs (they do not need to sum to 100). Use when you need several percentage estimates that are unrelated.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"multi-percentage"` |
| `config.inputs` | yes | Array of `{label, helper}` (min 2) |

**Agent prompt:** "Add a multi-percentage question asking the likelihood of purchasing each product"

---

## Ranking

### ranking

Drag-to-rank: respondent orders items by preference. Use for priority rankings, feature importance, or brand preference.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"ranking"` |
| `options` | yes | Array of options to rank (min 2) |

**Agent prompt:** "Add a ranking question asking them to rank these features by importance: Battery life, Camera quality, Screen size, Price, Durability"

---

## Grid / matrix

### grid (single)

Matrix question with single-select per row. Rows are the items being rated; columns are the rating scale.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"grid"` |
| `subtype` | no | `""` (default) for single-select per row |
| `options` | yes | Object: `{vertical: [{text}], horizontal: [{text}]}` |

```json
{
  "type": "grid",
  "subtype": "",
  "text": "Rate each brand on the following attributes.",
  "options": {
    "vertical": [
      {"text": "Nike"},
      {"text": "Adidas"},
      {"text": "New Balance"}
    ],
    "horizontal": [
      {"text": "Quality"},
      {"text": "Style"},
      {"text": "Value"},
      {"text": "Innovation"}
    ]
  }
}
```

**Agent prompt:** "Add a grid question rating Nike, Adidas, and New Balance on Quality, Style, Value, and Innovation"

### grid (multi)

Matrix with multi-select per row. Same structure, but respondents can pick multiple columns per row.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"grid"` |
| `subtype` | yes | `"multi"` |
| `options` | yes | Same nested structure as single grid |

**Agent prompt:** "Add a multi-select grid asking which features each product has"

> **Rating images?** To rate a set of images on a scale, use **image rating** — a grid whose rows are pictures. See [Image questions](#image-questions).

---

## Advanced research types

### nps

Net Promoter Score. Pre-configured 0-10 scale with Detractor/Passive/Promoter classification. No config or options needed — the scale is built in.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"nps"` |
| `text` | yes | Question prompt (conventionally "How likely are you to recommend...") |

**Agent prompt:** "Add an NPS question for our customer service team"

### maxdiff

Best-worst scaling exercise. Respondents see subsets of items and pick the best and worst in each set. The experimental design (which items appear in which sets) is auto-generated.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"maxdiff"` |
| `options` | yes | Full list of items (min 4) |
| `config.sets` | yes | Number of choice sets shown per respondent |
| `config.designs` | yes | Number of randomized design variants (typically 5-10) |
| `config.features` | yes | Items shown per set (typically 3-5) |
| `config.lowerText` | no | Label for "worst" pole. Default: `"Least Important"` |
| `config.upperText` | no | Label for "best" pole. Default: `"Most Important"` |

The `config.ranking` array (the experimental design) is auto-generated from the parameters. Do not set it manually.

```json
{
  "type": "maxdiff",
  "text": "Which product features are most and least important to you?",
  "options": [
    {"text": "Battery life"},
    {"text": "Camera quality"},
    {"text": "Screen size"},
    {"text": "Storage capacity"},
    {"text": "Water resistance"},
    {"text": "Processor speed"}
  ],
  "config": {
    "sets": 4,
    "designs": 5,
    "features": 3,
    "lowerText": "Least Important",
    "upperText": "Most Important"
  }
}
```

**Agent prompt:** "Add a maxdiff with 6 phone features: Battery life, Camera quality, Screen size, Storage, Water resistance, Processor speed. Show 3 per set, 4 sets, 5 designs."

> **Comparing images?** For a MaxDiff over pictures (including simple A‑vs‑B pairs), use **image comparison** — see [Image questions](#image-questions).

### conjoint

Choice-based conjoint analysis. Respondents choose between product profiles defined by combinations of attribute levels. The experimental design is auto-generated.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"conjoint"` |
| `config.sets` | yes | Choice sets per respondent |
| `config.designs` | yes | Number of design variants |
| `config.features` | yes | Profiles per choice set (typically 2-4) |
| `config.attributes` | yes | Array of attributes, each with `text` and `levels: [{text}]` (min 2 attributes, min 2 levels each) |

```json
{
  "type": "conjoint",
  "text": "Which laptop would you prefer?",
  "config": {
    "sets": 6,
    "designs": 8,
    "features": 3,
    "attributes": [
      {
        "text": "Brand",
        "levels": [{"text": "Apple"}, {"text": "Dell"}, {"text": "Lenovo"}]
      },
      {
        "text": "Price",
        "levels": [{"text": "$999"}, {"text": "$1,299"}, {"text": "$1,599"}]
      },
      {
        "text": "Screen Size",
        "levels": [{"text": "13 inch"}, {"text": "15 inch"}]
      }
    ]
  }
}
```

**Agent prompt:** "Create a conjoint for laptops with attributes Brand (Apple, Dell, Lenovo), Price ($999, $1299, $1599), and Screen Size (13in, 15in). 6 sets, 8 designs, 3 profiles per set."

### van-westendorp

Price Sensitivity Meter. Four price questions that together reveal acceptable price ranges. The four inputs must map to: too cheap, bargain, expensive, too expensive.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"van-westendorp"` |
| `config.inputs` | yes | Exactly 4 inputs, each with `label` (short id) and `helper` (displayed question text) |
| `config.currency` | no | ISO 4217 currency code. Default: `"USD"` |

```json
{
  "type": "van-westendorp",
  "text": "Thinking about this product, at what price would you say...",
  "config": {
    "currency": "USD",
    "inputs": [
      {"label": "1", "helper": "It is so cheap that you would question its quality?"},
      {"label": "2", "helper": "It is a bargain -- a great buy for the money?"},
      {"label": "3", "helper": "It is starting to get expensive but you would still consider it?"},
      {"label": "4", "helper": "It is too expensive to consider?"}
    ]
  }
}
```

**Agent prompt:** "Add a van-westendorp price sensitivity question for our new product"

---

## Image questions

Image questions use pictures as the stimulus instead of text. Under the hood they are **subtypes** of the choice, grid, and MaxDiff families, so they share the same answer schema and analysis as their parent type — they just render images and require an image on every stimulus.

Add the images in the builder (upload, AI‑generate, or pick a stock photo). Each image is normalized and hosted on the Flashpoint CDN, and referenced by its URL: `media_url` on an option (the picture for that choice), or `config.image_url` for a single base image. If any required image is missing, the survey will not validate.

### image carousel

Single‑ (or multi‑) select where each option is an image, shown in a swipeable carousel. Use for pack tests, ad/creative selection, or "pick the design you prefer."

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"select"` |
| `subtype` | yes | `"image_carousel"` |
| `text` | yes | Question prompt |
| `options` | yes | Array (min 2). Each: `{text, media_url}`. **Every option requires `media_url`** (the image); `text` is the caption |
| `config.selection` | no | `"single"` (default) or `"multi"` |
| `config.show_captions` | no | Show each option's `text` as a caption. Default `true` |
| `config.allow_zoom` | no | Allow tap/click to zoom an image. Default `true` |

```json
{
  "type": "select",
  "subtype": "image_carousel",
  "text": "Which packaging design do you prefer?",
  "options": [
    {"text": "Design A", "media_url": "https://cdn.flashpoint.ai/.../design-a.webp"},
    {"text": "Design B", "media_url": "https://cdn.flashpoint.ai/.../design-b.webp"},
    {"text": "Design C", "media_url": "https://cdn.flashpoint.ai/.../design-c.webp"}
  ],
  "config": {"selection": "single", "show_captions": true, "allow_zoom": true}
}
```

**Agent prompt:** "Add an image carousel asking which of three packaging designs they prefer." (Then upload or generate the image for each option.)

### image hotspot

Respondents click one or more regions on a single base image. Use for "tap what catches your eye," shelf/planogram tests, or pointing at parts of a design.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"select"` |
| `subtype` | yes | `"image_hotspot"` |
| `text` | yes | Question prompt |
| `config.image_url` | yes | URL of the base image the regions sit on |
| `options` | yes | One per clickable region. Each: `{text, coords}` where `coords` is `{x, y, w, h}` as **percentages (0–100)** of the base image |
| `config.selection` | no | `"single"` (default) or `"multi"` |

```json
{
  "type": "select",
  "subtype": "image_hotspot",
  "text": "Tap the area of the shelf you would reach for first.",
  "config": {
    "image_url": "https://cdn.flashpoint.ai/.../shelf.webp",
    "selection": "single"
  },
  "options": [
    {"text": "Top shelf", "coords": {"x": 5, "y": 4, "w": 90, "h": 28}},
    {"text": "Middle shelf", "coords": {"x": 5, "y": 36, "w": 90, "h": 28}},
    {"text": "Bottom shelf", "coords": {"x": 5, "y": 68, "w": 90, "h": 28}}
  ]
}
```

The builder includes a visual region editor — draw rectangles on the base image and the coordinates are filled in for you.

**Agent prompt:** "Add an image hotspot on the shelf photo asking which area they would reach for first." (Then upload the base image and draw the regions.)

### image rating

A grid whose **rows are images** and columns are a rating scale. Use to rate a set of creatives, products, or logos on the same scale.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"grid"` |
| `subtype` | yes | `"image_rating"` |
| `text` | yes | Question prompt |
| `options` | yes | `{vertical: [...rows], horizontal: [...columns]}`. **Every `vertical` row requires `media_url`**; `horizontal` columns are the rating labels |

```json
{
  "type": "grid",
  "subtype": "image_rating",
  "text": "Rate each ad on how appealing it is.",
  "options": {
    "vertical": [
      {"text": "Ad 1", "media_url": "https://cdn.flashpoint.ai/.../ad-1.webp"},
      {"text": "Ad 2", "media_url": "https://cdn.flashpoint.ai/.../ad-2.webp"}
    ],
    "horizontal": [
      {"text": "Not at all appealing"},
      {"text": "Somewhat appealing"},
      {"text": "Very appealing"}
    ]
  }
}
```

**Agent prompt:** "Add an image rating grid to rate each of these ads on a 3-point appeal scale." (Then upload an image for each row.)

### image comparison

A MaxDiff where the **items are images**. With two images per set it is a simple A‑vs‑B pairwise comparison; with more, it is best‑worst scaling over images. Use for preference testing across many creatives.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"maxdiff"` |
| `subtype` | yes | `"image_compare"` |
| `options` | yes | Full list of image items (min 4). Each: `{text, media_url}`. **Every item requires `media_url`** |
| `config.sets` | yes | Choice sets shown per respondent |
| `config.designs` | yes | Number of randomized design variants |
| `config.features` | yes | Images per set — use `2` for A‑vs‑B pairwise |

```json
{
  "type": "maxdiff",
  "subtype": "image_compare",
  "text": "In each pair, which image do you prefer?",
  "options": [
    {"text": "Image 1", "media_url": "https://cdn.flashpoint.ai/.../1.webp"},
    {"text": "Image 2", "media_url": "https://cdn.flashpoint.ai/.../2.webp"},
    {"text": "Image 3", "media_url": "https://cdn.flashpoint.ai/.../3.webp"},
    {"text": "Image 4", "media_url": "https://cdn.flashpoint.ai/.../4.webp"}
  ],
  "config": {"sets": 6, "designs": 5, "features": 2}
}
```

**Agent prompt:** "Add an image comparison over these 6 creatives, shown 2 at a time, 6 sets, 5 designs." (Then upload an image for each item.)

---

## Structural types

### transition

Display-only screen with text or instructions between sections. No answer is collected. Use to introduce a new topic or provide context.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"transition"` |
| `text` | yes | Content to display |

**Agent prompt:** "Add a transition screen introducing the product evaluation section"

### terminate

Ends the survey immediately. Used as a routing destination for disqualification logic. Auto-labels as `S1`, `S2`, etc.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"terminate"` |
| `text` | yes | Message shown on termination (e.g., "Thank you for your time.") |

**Agent prompt:** "Add a terminate screen that says 'Thank you for your interest, but you do not qualify for this survey.'"

### variable

Hidden computed field. Stores a DSL expression that is evaluated at runtime from other question answers. Not shown to respondents. Used for computed routing, scoring, or downstream data enrichment.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"variable"` |
| `text` | yes | Internal description of what the variable computes |

Variables are typically added after all questions exist, since their definitions reference other question labels.

**Agent prompt:** "Add a variable that computes a satisfaction score from Q3 and Q5"

### ai-chat

Conversational AI follow-up. Opens a freeform chat interface where the AI probes deeper based on prior answers. Use for qualitative depth on key topics.

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"ai-chat"` |
| `text` | yes | The AI's opening prompt |

**Agent prompt:** "Add an AI chat follow-up asking them to elaborate on their product experience"

---

## Common configuration

These fields apply across all question types.

| Field | Type | Default | Description |
|---|---|---|---|
| `label` | string | Auto (`Q1`, `Q2`...) | Stable identifier used in skip logic and data exports |
| `config.required` | bool | `true` | Whether the question must be answered |
| `config.randomize` | bool | `false` | Shuffle option order per respondent |
| `optout` | object | none | `{allowed: true, text: "Prefer not to say"}` adds a skip button |
| `condition` | string | none | DSL display condition — see [Skip logic](/skip-logic) |
| `skips` | array | `[]` | Skip/branch rules — see [Skip logic](/skip-logic) |

## Option types

Options in choice-based questions support a `type` field:

| Type | Behavior |
|---|---|
| `"user"` | Standard option (default) |
| `"other"` | Write-in: shows a text input when selected |
| `"nota"` | "None of the above": exclusive — deselects all others when chosen |
| `"dontknow"` | "Don't know" option |
| `"optout"` | Opt-out option |
| `"notapplicable"` | "Not applicable" option |

## Next steps

- Add branching and screening: [Skip logic & conditions](/skip-logic)
- Control sample composition: [Quotas](/quotas)
- Build surveys conversationally: [Agent](/surveys-agent)


---

# Skip logic & conditions

Control survey flow based on respondent answers. Flashpoint.AI uses a single DSL (domain-specific language) for display conditions, skip rules, quota definitions, and variable assignments. The same syntax applies in all four contexts.

---

## DSL syntax reference

Conditions are strings evaluated at runtime against the respondent's answers. Question labels (e.g., `Q1`, `Q3`) resolve to the respondent's answer for that question.

### Operators

| Operator | Syntax | Description |
|---|---|---|
| Equals | ``Q1 == `2` `` | True if Q1's selected option label is 2 |
| Not equals | ``Q1 != `2` `` | True if Q1's selected option label is not 2 |
| Greater than | ``Q1 > 18`` | Numeric comparison |
| Greater or equal | ``Q1 >= 18`` | Numeric comparison |
| Less than | ``Q1 < 18`` | Numeric comparison |
| Less or equal | ``Q1 <= 18`` | Numeric comparison |
| In list | ``Q1 IN [`1`, `2`, `3`]`` | True if Q1's answer is in the list |
| Not in list | ``Q1 NOT IN [`4`, `5`]`` | True if Q1's answer is not in the list |
| And | ``(Q1 == `1`) AND (Q2 > 5)`` | Both conditions must be true |
| Or | ``(Q1 == `1`) OR (Q2 == `1`)`` | Either condition must be true |
| Not | ``NOT (Q1 == `1`)`` | Negation |
| Xor | ``(Q1 == `1`) XOR (Q2 == `1`)`` | Exactly one must be true |

### Value syntax

- **Option labels** are wrapped in backticks: `` `1` ``, `` `2` ``, `` `3` ``
- **Numeric literals** are bare: `18`, `100`, `3.5`
- **Strings** use quotes: `"complete"`, `'active'`
- **Boolean literals**: `TRUE`, `FALSE`
- **Null**: `NULL`
- **Logical operators** are always uppercase: `AND`, `OR`, `NOT`, `XOR`, `IN`, `NOT IN`

### Identifiers

An identifier is a question label that resolves to the respondent's answer:

| Pattern | Resolves to |
|---|---|
| `Q1` | Single-select: the selected option. Multi-select: array of selected options |
| `Q3\Row1` | Grid response: the column selected for Row1. Backslash separates row label |
| `STATUS` | Current response status string (e.g., `"COMPLETE"`) |

### Multi-select behavior

For multi-select questions, `==` checks array containment (whether the value is among the selections), not strict equality. `IN` checks whether any selected option is in the list.

```
Q5 == `3`              -- true if option 3 is among the selected options
Q5 IN [`1`, `2`, `3`]  -- true if ANY of the selected options is 1, 2, or 3
Q5 NOT IN [`4`, `5`]   -- true if NONE of the selected options is 4 or 5
```

### Aggregate functions

Use with list operands for computed conditions:

| Function | Example | Description |
|---|---|---|
| `COUNT` | `COUNT(Q5) > 2` | Number of selections in a multi-select |
| `MIN` | `MIN(Q5) >= 3` | Minimum numeric value in a list |
| `MAX` | `MAX(Q5) <= 10` | Maximum numeric value |
| `MEAN` | `MEAN(Q5) > 5` | Arithmetic mean |
| `MEDIAN` | `MEDIAN(Q5) == 5` | Median value |

### List functions

| Function | Example | Description |
|---|---|---|
| `FILTER_X` | `FILTER_X(Q5, X > 3)` | Filter list items where the expression is true |
| `MAP_X` | `MAP_X(Q5, X + 1)` | Transform each list item |
| `OPTIONS` | `OPTIONS(Q3)` | Access the defined options for a question (for piping) |

### Arithmetic

The DSL supports arithmetic for computed variables: `+`, `-`, `*`, `/`, `**` (exponent). Standard precedence applies; use parentheses to override.

```
Q7 + Q8               -- sum of two numeric answers
(Q7 * 100) / Q8       -- percentage calculation
Q9 ** 2               -- square
```

---

## Display conditions

A display condition on a question controls whether the respondent sees it. If the condition evaluates to `false` (or the referenced question hasn't been answered yet), the question is skipped silently.

Set the `condition` field on a question:

```json
{
  "type": "text",
  "text": "What did you dislike about the product?",
  "condition": "Q3 IN [`4`, `5`]"
}
```

This question only appears if the respondent selected option 4 or 5 on Q3.

### API example

```bash
curl -X PATCH https://api.flashpoint.ai/api/v1/surveys/{survey_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "blocks": [{
        "name": "Follow-up",
        "questions": [{
          "type": "text",
          "text": "What did you dislike about the product?",
          "condition": "Q3 IN [`4`, `5`]"
        }]
      }]
    }
  }'
```

### Agent example

"Add a follow-up question 'What did you dislike about the product?' that only shows if Q3 is 4 or 5"

---

## Skip rules

Skip rules are post-answer branching: after the respondent answers a question, evaluate conditions and route them accordingly. Each question can have multiple skip rules in its `skips` array.

### Skip rule structure

```json
{
  "condition": "Q2 == `1`",
  "action": {
    "type": "skip",
    "label": "Q7"
  }
}
```

### Action types

| Action | `type` | `label` | Behavior |
|---|---|---|---|
| Skip to question | `"skip"` | Required: target question label | Jump to the specified question, skipping everything in between |
| Disqualify | `"disqualify"` | Not used | Mark the respondent as disqualified. Survey continues to a terminate screen |
| Terminate | `"terminate"` | Not used | End the survey immediately |

### Examples

**Screen out under-18 respondents:**

```json
{
  "type": "number",
  "label": "Q1",
  "text": "How old are you?",
  "config": {"datarange": [1, 120]},
  "skips": [
    {
      "condition": "Q1 < 18",
      "action": {"type": "terminate"}
    }
  ]
}
```

**Skip to demographics if they selected "Not interested":**

```json
{
  "skips": [
    {
      "condition": "Q5 == `5`",
      "action": {"type": "skip", "label": "Q20"}
    }
  ]
}
```

**Disqualify non-owners:**

```json
{
  "skips": [
    {
      "condition": "Q2 == `2`",
      "action": {"type": "disqualify"}
    }
  ]
}
```

### Agent examples

- "On Q1, if the answer is less than 18, terminate the survey"
- "On Q3, if they select 'No' (option 2), skip to Q10"
- "On the screener, if they don't own the product, disqualify them"

---

## Compound conditions

Combine multiple conditions with logical operators. Always wrap sub-expressions in parentheses for clarity.

### AND — both must be true

```
(Q2 == `1`) AND (Q5 IN [`3`, `4`])
```

Show this question only to males (Q2 option 1) who are in age groups 3 or 4 (Q5).

### OR — either can be true

```
(Q3 == `1`) OR (Q3 == `2`)
```

Equivalent to `Q3 IN [`1`, `2`]` but useful when the two conditions reference different questions.

### Complex routing

```
(Q2 == `1`) AND (Q4 >= 25) AND (Q4 <= 34)
```

Males aged 25-34 only.

```
((Q1 == `1`) OR (Q1 == `2`)) AND (NOT (Q6 == `5`))
```

Respondents who chose option 1 or 2 on Q1, but did not choose option 5 on Q6.

---

## Grid conditions

Reference specific rows in a grid question using backslash notation:

```
Q3\Row1 == `5`
```

True if the respondent selected column 5 for Row1 in grid question Q3. The part after the backslash is the row's option label.

---

## Variable assignments

Variable questions (`type: "variable"`) store DSL expressions that compute values from other answers. The expression is evaluated at runtime as an `assignment` program (not a `condition`).

```json
{
  "type": "variable",
  "label": "V1",
  "text": "Satisfaction score",
  "config": {
    "definition": "Q3 + Q5 + Q7"
  }
}
```

Variables can reference other variables, creating computed chains. The evaluator handles recursive resolution.

### Common variable patterns

| Pattern | Expression | Use case |
|---|---|---|
| Sum score | `Q3 + Q5 + Q7` | Composite index from multiple ratings |
| Weighted average | `(Q3 * 2 + Q5 * 3) / 5` | Weighted satisfaction score |
| Selection count | `COUNT(Q8)` | How many items they selected in a multi-select |
| Conditional value | `FILTER_X(OPTIONS(Q3), X > 3)` | Filter selected options above a threshold |

---

## Validation tools

Flashpoint.AI provides two validation tools to catch logic errors before publishing.

### validate_dsl

Parses a DSL expression and checks syntax. Use before setting complex conditions.

```bash
# Agent tool call
validate_dsl(condition="(Q1 == `1`) AND (Q2 > 5)", program_type="condition")
```

Returns:

```json
{
  "valid": true,
  "identifiers": ["Q1", "Q2"]
}
```

If invalid:

```json
{
  "valid": false,
  "error": "Unexpected token: \"}\"",
  "identifiers": []
}
```

**Agent prompt:** "Validate this condition: (Q1 == `1`) AND (Q2 > 5)"

### surveycheck

Runs a full validation pass on the entire survey's logic. Call this before publishing to catch:

| Check | What it catches |
|---|---|
| Unknown identifiers | A skip condition references `Q99` but no question has label `Q99` |
| Invalid DSLs | A condition string that fails to parse |
| Unreachable questions | A display condition that always evaluates to false |
| Post-logic identifiers | A variable definition references a label that does not exist |

The tool also offers corrections — if you reference `Q99` but the closest match is `Q9`, it suggests the fix.

**Agent prompt:** "Run surveycheck on this survey to validate all the logic before we publish"

---

## Common patterns

### Screener with DQ

A typical screener flow: ask a qualifying question, disqualify those who don't qualify, then continue to the main survey.

```
Q1: "Do you own a car?" (select single: Yes / No)
    skip: Q1 == `2` → disqualify

Q2: "What year is your car?" (year, condition: Q1 == `1`)

S1: "Thank you, you do not qualify." (terminate)
```

### Show-if-selected

Show a follow-up only when a specific option was chosen:

```
Q3: "Which brands do you use?" (multi-select)
Q4: "What do you like about Nike?" (text, condition: Q3 == `1`)
Q5: "What do you like about Adidas?" (text, condition: Q3 == `2`)
```

### Numeric range gate

Route based on a numeric threshold:

```
Q7: "How many employees does your company have?" (number)
    skip: Q7 < 50 → skip to Q12     (small business path)
    skip: Q7 >= 500 → skip to Q15   (enterprise path)
```

Questions Q8-Q11 are the mid-market path (50-499 employees).

### Attention check

Insert a question with a known correct answer and terminate respondents who fail:

```
Q10: "Please select 'Strongly agree' for this question." (select single)
     skip: Q10 != `1` → terminate
```

## Next steps

- Learn about all question types: [Question types](/question-types)
- Control sample composition: [Quotas](/quotas)
- Validate before publishing: [Lifecycle](/surveys-lifecycle)


---

# Quotas

Quotas control the composition of your sample by capping how many responses are collected for each demographic segment. They prevent over-collection in easy-to-reach groups and ensure your final dataset matches your target proportions.

---

## How quotas work

Each quota has three parts:

| Part | Example | Description |
|---|---|---|
| **Name** | `"Males 25-34"` | Human-readable label for reporting |
| **Target** | `250` | Number of completes needed |
| **Definition** | ``"Q2 == `1` AND Q5 IN [`3`, `4`]"`` | DSL condition that determines which responses count. `null` for a total quota |

When a respondent submits, the system evaluates every active quota's definition against their answers. If the response matches a quota and that quota is full, the response is rejected as over-quota.

### Enforcement architecture

Quotas are enforced atomically using a two-tier system:

- **Redis** holds live counters for sub-millisecond check-and-increment during response ingestion. A Lua script checks all applicable quotas atomically — if any quota is full, none increment, preventing race conditions.
- **PostgreSQL** is the source of truth for quota definitions and historical counts.
- **Reconciliation** syncs PostgreSQL counts to Redis every 5 minutes, correcting any drift from failures or manual exclusions.

The system fails open: if Redis is unavailable, responses are accepted and reconciliation corrects the counts later.

---

## Total vs conditional quotas

### Total quota

A quota with `definition: null` counts every complete response regardless of answers. Use this to cap your overall sample size.

```json
{
  "name": "Total",
  "target": 1000,
  "definition": null
}
```

### Conditional quota

A quota with a DSL condition string counts only responses that match. The DSL syntax is the same as [skip logic conditions](/skip-logic).

```json
{
  "name": "Males 25-34",
  "target": 250,
  "definition": "Q2 == `1` AND Q5 IN [`3`, `4`]"
}
```

### Common quota structures

**Gender quotas:**

```json
[
  {"name": "Total", "target": 1000, "definition": null},
  {"name": "Male", "target": 500, "definition": "Q2 == `1`"},
  {"name": "Female", "target": 500, "definition": "Q2 == `2`"}
]
```

**Nested quotas (gender x age):**

```json
[
  {"name": "Total", "target": 1000, "definition": null},
  {"name": "Males 18-34", "target": 250, "definition": "(Q2 == `1`) AND (Q3 IN [`1`, `2`])"},
  {"name": "Males 35-54", "target": 250, "definition": "(Q2 == `1`) AND (Q3 IN [`3`, `4`])"},
  {"name": "Females 18-34", "target": 250, "definition": "(Q2 == `2`) AND (Q3 IN [`1`, `2`])"},
  {"name": "Females 35-54", "target": 250, "definition": "(Q2 == `2`) AND (Q3 IN [`3`, `4`])"}
]
```

**Regional quotas:**

```json
[
  {"name": "Total", "target": 600, "definition": null},
  {"name": "Northeast", "target": 150, "definition": "Q4 IN [`1`, `2`, `3`]"},
  {"name": "Southeast", "target": 150, "definition": "Q4 IN [`4`, `5`, `6`]"},
  {"name": "Midwest", "target": 150, "definition": "Q4 IN [`7`, `8`, `9`]"},
  {"name": "West", "target": 150, "definition": "Q4 IN [`10`, `11`, `12`]"}
]
```

---

## Setting quotas

### Bulk replace (recommended for initial setup)

Replace all quotas at once. This deactivates any existing quotas and creates new ones.

```bash
curl -X PUT https://api.flashpoint.ai/api/v1/surveys/{survey_id}/quotas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quotas": [
      {"name": "Total", "target": 1000, "definition": null},
      {"name": "Male", "target": 500, "definition": "Q2 == `1`"},
      {"name": "Female", "target": 500, "definition": "Q2 == `2`"}
    ]
  }'
```

**Response** (`200 OK`):

```json
{
  "total_target": 1000,
  "total_collected": 0,
  "overall_fill_percentage": 0.0,
  "all_quotas_met": false,
  "quotas": [
    {
      "id": "a1b2c3d4-...",
      "name": "Total",
      "target": 1000,
      "current_count": 0,
      "fill_percentage": 0.0,
      "remaining": 1000,
      "is_full": false,
      "is_active": true,
      "definition": null,
      "created_at": "2026-05-26T10:00:00Z",
      "updated_at": "2026-05-26T10:00:00Z"
    }
  ]
}
```

**Agent prompt:** "Set quotas: 1000 total, 500 males (Q2 option 1), 500 females (Q2 option 2)"

### Add a single quota

Add one quota without touching existing ones.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/quotas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "California",
    "target": 100,
    "definition": "Q4 == `5`"
  }'
```

**Response** (`201 Created`):

```json
{
  "id": "e5f6g7h8-...",
  "name": "California",
  "target": 100,
  "definition": "Q4 == `5`"
}
```

**Agent prompt:** "Add a regional quota for California respondents, target 100, based on Q4 option 5"

### Update a quota

Change a quota's name or target. Only the fields you provide are modified.

The agent tool `update_quota` accepts `quota_id`, and optionally `name` and/or `target`.

**Agent prompt:** "Increase the female quota to 600"

### Delete a quota

Soft-deletes a quota (sets `is_active = false`). Redis counters are removed immediately.

**Agent prompt:** "Delete the California quota"

---

## Monitoring progress

### Get quota summary

Returns live fill counts from Redis for every active quota.

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/quotas \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "total_target": 1000,
  "total_collected": 347,
  "overall_fill_percentage": 34.7,
  "all_quotas_met": false,
  "quotas": [
    {
      "id": "a1b2c3d4-...",
      "name": "Total",
      "target": 1000,
      "current_count": 347,
      "fill_percentage": 34.7,
      "remaining": 653,
      "is_full": false,
      "is_active": true,
      "definition": null,
      "created_at": "2026-05-26T10:00:00Z",
      "updated_at": "2026-05-26T10:00:00Z"
    },
    {
      "id": "b2c3d4e5-...",
      "name": "Male",
      "target": 500,
      "current_count": 189,
      "fill_percentage": 37.8,
      "remaining": 311,
      "is_full": false,
      "is_active": true,
      "definition": "Q2 == `1`",
      "created_at": "2026-05-26T10:00:00Z",
      "updated_at": "2026-05-26T10:00:00Z"
    },
    {
      "id": "c3d4e5f6-...",
      "name": "Female",
      "target": 500,
      "current_count": 158,
      "fill_percentage": 31.6,
      "remaining": 342,
      "is_full": false,
      "is_active": true,
      "definition": "Q2 == `2`",
      "created_at": "2026-05-26T10:00:00Z",
      "updated_at": "2026-05-26T10:00:00Z"
    }
  ]
}
```

**Agent prompt:** "Show me the quota progress for this survey"

### Export quota report

The agent's `export_quota_report` tool returns quota progress combined with response analytics (total responses, completes, completion rate, median time). Use it for fieldwork status updates.

**Agent prompt:** "Give me a fieldwork status report with quota progress"

**Response shape:**

```json
{
  "survey_id": "...",
  "analytics": {
    "total_responses": 412,
    "completes": 347,
    "completion_rate": 84.2,
    "median_time_ms": 245000
  },
  "quota_summary": {
    "total_target": 1000,
    "total_collected": 347,
    "overall_fill_percentage": 34.7,
    "all_quotas_met": false
  },
  "quotas": [
    {
      "name": "Total",
      "target": 1000,
      "current_count": 347,
      "fill_percentage": 34.7,
      "remaining": 653,
      "is_full": false
    }
  ]
}
```

---

## Reconciliation

Reconciliation recounts all quotas from actual response data in PostgreSQL and syncs the counts to Redis. This corrects drift caused by:

- Response exclusions (manually removing a response after it was counted)
- Redis failures during ingestion (the system fails open, so responses are accepted)
- Manual data corrections

### Automatic reconciliation

Runs every 5 minutes as a background job. No action required.

### Manual reconciliation

Trigger a recount on demand after excluding responses or if counts look off.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/quotas/reconcile \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "status": "reconciled"
}
```

**Agent prompt:** "Reconcile the quotas — I just excluded some test responses"

The agent's `reconcile_quotas` tool returns the updated counts after reconciliation:

```json
{
  "reconciled": true,
  "total_collected": 340,
  "quotas": [
    {"name": "Total", "target": 1000, "current_count": 340},
    {"name": "Male", "target": 500, "current_count": 185},
    {"name": "Female", "target": 500, "current_count": 155}
  ]
}
```

---

## Events

The quota system emits events that can drive notifications and automations:

| Event | Trigger | Use case |
|---|---|---|
| `QUOTA_UPDATED` | Quotas are bulk-replaced | Audit trail |
| `QUOTA_WARNING` | A quota reaches 80% fill | Alert the team to adjust panel sources |
| `QUOTA_REACHED` | A quota hits its target | Close a panel source, notify stakeholders |

---

## Best practices

1. **Always include a total quota.** Without one, there is no cap on overall sample size.

2. **Set conditional quotas after building questions.** Quota definitions reference question labels, so the questions must exist first.

3. **Use the same DSL syntax as skip logic.** The condition language is identical — see [Skip logic & conditions](/skip-logic) for the full reference.

4. **Over-recruit slightly.** Set targets 5-10% above your analysis plan to account for exclusions and quality checks.

5. **Monitor fill rates during fielding.** Use `get_quota_progress` or the agent's fieldwork report to check if any cells are filling too slowly.

6. **Reconcile after bulk exclusions.** If you exclude a batch of responses (speed checks, quality flags), run reconciliation so the counts reflect the remaining valid data.

7. **Keep quotas simple.** Each additional conditional quota adds a Redis key check during ingestion. For typical surveys (under 50 quotas), this has no measurable impact. For very large quota matrices, consider collapsing into fewer conditions.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/surveys/{survey_id}/quotas` | Get quota summary with live counts |
| `POST` | `/api/v1/surveys/{survey_id}/quotas` | Create a single quota |
| `PUT` | `/api/v1/surveys/{survey_id}/quotas` | Bulk replace all quotas |
| `POST` | `/api/v1/surveys/{survey_id}/quotas/reconcile` | Manual reconciliation |

All endpoints require a bearer token — see [Authentication](/authentication). Your team is resolved from the token, so no team or user header is needed.

## Next steps

- Write conditions for quotas: [Skip logic & conditions](/skip-logic)
- Learn about all question types: [Question types](/question-types)
- Publish and field the survey: [Lifecycle](/surveys-lifecycle)


---

# Lifecycle & versioning

A survey moves through five states. Edits to a published survey create new versions without disturbing in-flight respondents, and you can roll back to any prior version at any time.

## Status transitions

```
               publish              pause
  ┌─────────┐ ────────► ┌────────┐ ────────► ┌────────┐
  │  DRAFT  │           │ ACTIVE │           │ PAUSED │
  └─────────┘           └────────┘ ◄──────── └────────┘
                             │      resume        │
                             │                    │
                             │     complete       │
                             ▼                    │
                        ┌───────────┐  complete   │
                        │ COMPLETED │ ◄───────────┘
                        └───────────┘
                             │
                             │ archive
                             ▼
                        ┌───────────┐
                        │ ARCHIVED  │
                        └───────────┘
```

| State | Behavior |
|-------|----------|
| `draft` | Not visible to respondents. No public URL. Edits modify the document in place — no version forking until you publish. |
| `active` | Live. Respondents can take the survey via any open distribution channel. Edits create a new pending version alongside the live one. |
| `paused` | Temporarily stopped. In-flight respondents can finish; new arrivals see a "survey paused" page. Resume reopens collection. |
| `completed` | Permanently closed. Responses are final, the public URL serves a closing page. Clone the survey to start a new collection round. |
| `archived` | Hidden from default lists but still queryable. Use to keep a long-tail of finished studies tidy without losing the underlying data. Filter listings by `status=archived` to see them. |

## Publish

Publishing transitions a survey from `draft` (or `paused`) to `active`. This is the point where the survey becomes available to respondents. The current document is pinned as version 1 and the `current_version` pointer is set.

### Pre-publish validation

The platform runs a quality check before publishing. Issues are returned as warnings but do not block the publish:

- Unknown identifiers in skip logic DSL
- Invalid DSL expressions
- Unreachable questions (skipped by all paths)
- Post-logic identifier references

Run validation explicitly with the spellcheck endpoint beforehand (see [Build](/surveys-build#pre-publish-validation)).

### REST API

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/publish \
  -H "Authorization: Bearer $TOKEN"
```

Response (`200 OK`):

```json
{
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "name": "Brand Perception Study Q1 2026",
  "status": "active",
  "current_version": 1,
  "revision": 2,
  "published_at": "2026-05-26T15:30:00Z"
}
```

### Agent

> "Publish my survey"

The agent triggers a confirmation prompt before executing — publishing is flagged as a destructive action because subsequent edits create new versions rather than modifying in place.

## Pause

Pausing temporarily stops a survey from accepting new responses. Respondents who are mid-survey can finish, but new arrivals see a paused page. The version pointer is unchanged.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/pause \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "id": "a1b2c3d4-...",
  "status": "paused"
}
```

Resume by calling publish again (`POST .../publish`). No data is lost.

### Agent

> "Pause the survey"
>
> "Resume the Costco brand study"

## Complete

Completing permanently closes response collection. Unlike pause, this is final — the survey becomes read-only. Clone it to start a new collection round.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/complete \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "id": "a1b2c3d4-...",
  "status": "completed",
  "completed_at": "2026-06-15T09:00:00Z"
}
```

### Agent

> "Close out the survey — we have enough responses"

## Versioning model

A `survey` is a long-lived container. Its content lives in immutable `survey_version` rows. Each time you change questions, options, or logic on a published survey, a new version is written. The survey's `current_version` pointer determines what respondents see; edits land in a pending draft until you push them live.

### How it works

1. **Draft surveys** have one version. Edits modify it in place.
2. **Published surveys** fork on edit. The live version stays live while a new pending version accumulates changes.
3. **Push** flips the `current_version` pointer atomically. New respondents see the updated version; respondents already mid-survey finish on the version they started.
4. Responses always reference the version they were collected against, so renaming a question does not rewrite historical data.

### List versions

```bash
curl https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/versions \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "id": "ver-001",
    "survey_id": "a1b2c3d4-...",
    "version": 1,
    "document": { "blocks": [ "..." ] },
    "changes_summary": null,
    "changed_by": "f0e1d2c3-...",
    "created_at": "2026-05-26T14:00:00Z"
  },
  {
    "id": "ver-002",
    "survey_id": "a1b2c3d4-...",
    "version": 2,
    "document": { "blocks": [ "..." ] },
    "changes_summary": "Added Q6 NPS question",
    "changed_by": "f0e1d2c3-...",
    "created_at": "2026-05-27T10:15:00Z"
  }
]
```

### Agent

> "Show me the version history"

### Get a specific version

```bash
curl https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/versions/1 \
  -H "Authorization: Bearer $TOKEN"
```

Returns the full version object including its document snapshot.

### Compare versions

The agent's `compare_versions` tool diffs two versions by question label, showing what was added, removed, or modified.

> "What changed between version 1 and version 3?"

The diff output structure:

```json
{
  "version_a": 1,
  "version_b": 3,
  "added": [
    { "label": "Q6", "text": "How likely are you to recommend us?", "type": "nps", "block": "Evaluation" }
  ],
  "removed": [],
  "modified": [
    {
      "label": "Q2",
      "before": { "text": "Which brands have you used?", "type": "select", "block": "Screener" },
      "after":  { "text": "Which brands have you purchased in the last 6 months?", "type": "select", "block": "Screener" }
    }
  ],
  "total_changes": 2
}
```

### Push a version live

After editing a published survey, the pending version does not go live until you explicitly push it.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/versions/2/push \
  -H "Authorization: Bearer $TOKEN"
```

Response: the full survey detail with the updated document.

### Agent

> "Push the changes live"

The agent confirms before pushing, since this changes what respondents see.

### Create a draft from the live version

For published surveys without a pending draft, fork the live version into an editable copy:

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/draft \
  -H "Authorization: Bearer $TOKEN"
```

This is idempotent: if a pending draft already exists, the existing draft is returned.

### Restore a previous version

Restoring rolls back a bad change. It copies the old version's document into a new version — versions are immutable, so "undo" is always a new row. History is preserved.

> "Go back to version 1"

After restoring, you get a new version with the old content. Push it live to make respondents see it.

### Agent

> "Undo the last change"
>
> "Restore version 2"

### Version record fields

Every version row records:

| Field | Description |
|-------|-------------|
| `version` | Monotonically increasing integer per survey |
| `document` | Full survey document snapshot (blocks, questions, logic) |
| `changes_summary` | Short description of what changed (auto-filled by agent, editable) |
| `changed_by` | UUID of the user who created this version |
| `created_at` | Timestamp |

## Clone

Cloning creates an exact copy of a survey as a new draft. The clone gets all questions, logic, and settings from the source's current version. Responses do not carry over.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/clone \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "name": "Brand Study Wave 2" }'
```

Response (`201 Created`): the full survey detail of the new draft.

Use cases:

- Reopen collection on a completed survey (the original stays read-only as a historical record)
- Create an A/B variant with different question orderings
- Hand off a design to a colleague as a starting point

### Agent

> "Clone the brand study as Brand Study Wave 2"

## Translate

Translation creates a new survey (via clone) with all user-facing text translated to the target language. The translation is AI-powered and preserves question labels, DSL logic conditions, and document structure. The original survey is untouched.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "target_language": "Spanish",
    "new_name": "Estudio de Percepcion de Marca Q1 2026"
  }'
```

```json
{
  "original_survey_id": "a1b2c3d4-...",
  "translated_survey_id": "e5f6a7b8-...",
  "translated_survey_name": "Estudio de Percepcion de Marca Q1 2026",
  "language": "Spanish",
  "texts_translated": 47
}
```

What gets translated: question text, option text, block names, helper text on Van Westendorp/conjoint/percent-sum inputs, and conjoint attribute and level labels. What stays unchanged: question labels (`Q1`, `S2`), DSL conditions (``Q2 == `6` ``), IDs, and structural configuration.

### Agent

> "Translate my sneaker survey to Japanese"

## Delete

Soft-deletes the survey. Data is preserved for audit purposes but the survey no longer appears in listings or accepts responses. This cannot be undone through the API.

```bash
curl -X DELETE https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID \
  -H "Authorization: Bearer $TOKEN"
```

Response: `204 No Content`.

## Things to know

- **Publish requires at least one question.** An empty draft returns an error.
- **Pausing does not cancel email sends in flight.** Queued email invitations still go out — recipients who click through see the paused page.
- **Completed is terminal.** Reopen collection by cloning to a new draft.
- **Versions are immutable.** You cannot delete or rewrite a version. Use restore to roll back.
- **Each save is one version.** Rapid edit-save loops on a published survey produce a chain of small versions. This is expected and cheap.
- **Mutations are locked.** Concurrent REST mutations on the same survey are serialized via a Redis lock. Agent-side operations use optimistic concurrency with automatic retry.

## Next steps

- Build the survey content: [Build](/surveys-build)
- Start from a pre-built design: [Templates](/templates)
- Send it to respondents: [Distribute](/surveys-distribute)
- Analyze results: [Analyze](/surveys-analyze)


---

# Templates

Templates are pre-built survey designs you can start from instead of building from scratch. Each template contains a complete survey document — blocks, questions, options, logic, and settings — ready to customize for your project.

## Categories

Templates are organized into four categories:

| Category | Description | Examples |
|----------|-------------|----------|
| `brand` | Brand health, perception, and awareness studies | Brand tracker, competitive perception, brand awareness |
| `cx` | Customer experience and satisfaction | CSAT survey, post-purchase feedback, customer effort score |
| `employee` | Internal workforce research | Employee engagement, onboarding feedback, pulse check |
| `custom` | Team-created templates saved from previous surveys | Any survey saved as a template by your team |

The first three categories contain platform-provided templates available to all teams. The `custom` category is team-scoped — templates you save are only visible to your team.

## Listing templates

Retrieve available templates, optionally filtered by category.

```bash
curl "https://api.flashpoint.ai/api/v1/templates?category=brand&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "items": [
    {
      "id": "tmpl-001-aabb-ccdd-eeff-112233445566",
      "name": "Brand Health Tracker",
      "description": "Quarterly brand awareness, consideration, and usage tracking with competitive benchmarking. Includes aided/unaided awareness, brand attributes grid, and NPS.",
      "category": "brand",
      "is_public": true,
      "usage_count": 142,
      "created_by": "system",
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-03-10T00:00:00Z"
    },
    {
      "id": "tmpl-002-aabb-ccdd-eeff-112233445566",
      "name": "Competitive Perception Study",
      "description": "Head-to-head brand comparison using grid ratings, MaxDiff importance scaling, and open-ended probes.",
      "category": "brand",
      "is_public": true,
      "usage_count": 87,
      "created_by": "system",
      "created_at": "2026-01-15T00:00:00Z",
      "updated_at": "2026-02-20T00:00:00Z"
    }
  ],
  "total": 2,
  "limit": 10,
  "offset": 0
}
```

### Agent

> "Show me brand survey templates"
>
> "What templates do we have for customer experience?"

### Getting template details

To inspect the full document inside a template before using it:

```bash
curl https://api.flashpoint.ai/api/v1/templates/$TEMPLATE_ID \
  -H "Authorization: Bearer $TOKEN"
```

The response includes all metadata fields plus the `data` object containing the full survey document (blocks, questions, options, logic).

## Creating a survey from a template

Create a new draft survey pre-populated with the template's content.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/templates/$TEMPLATE_ID/create-survey \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "name": "Q2 Brand Health Tracker" }'
```

Response (`201 Created`):

```json
{
  "survey_id": "new-survey-uuid-here",
  "version": 1
}
```

The new survey starts in `draft` status with all the template's questions, blocks, and logic. Customize it with any of the [Build](/surveys-build) operations — add or remove questions, change options, update logic — before publishing.

If you omit the `name` field, the survey is named after the template (e.g., "Brand Health Tracker Survey").

### Agent

> "Create a survey from the Brand Health Tracker template"
>
> "Use the CSAT template to start a new post-purchase feedback survey called Q2 Checkout Experience"

## Saving a survey as a template

Turn any survey into a reusable template. The survey's current document is snapshot into the template — future edits to the survey do not affect the saved template.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/templates/from-survey/$SURVEY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Standard Brand Tracker v2",
    "description": "Updated brand tracker with MaxDiff importance scaling and AI follow-up probes",
    "category": "custom"
  }'
```

Response (`201 Created`):

```json
{
  "id": "tmpl-new-uuid-here",
  "name": "Standard Brand Tracker v2",
  "description": "Updated brand tracker with MaxDiff importance scaling and AI follow-up probes",
  "category": "custom",
  "is_public": false,
  "usage_count": 0,
  "created_by": "f0e1d2c3-b4a5-6789-0123-456789abcdef",
  "created_at": "2026-05-26T16:00:00Z",
  "updated_at": "2026-05-26T16:00:00Z",
  "data": {
    "blocks": [ "..." ]
  }
}
```

All fields are optional except `category`. If `name` is omitted, it defaults to the survey's name with "Template" appended.

### Agent

> "Save this survey as a template"
>
> "Save the Q1 brand study as a template called Standard Brand Tracker in the brand category"

## Deleting a template

```bash
curl -X DELETE https://api.flashpoint.ai/api/v1/templates/$TEMPLATE_ID \
  -H "Authorization: Bearer $TOKEN"
```

Response: `204 No Content`.

Deleting a template does not affect surveys that were previously created from it.

## Visibility

| `is_public` | Who can see it | Who can create it |
|-------------|----------------|-------------------|
| `true` | All teams on the platform | Platform administrators only |
| `false` | Only the team that created it | Any team member |

Templates saved via `POST /api/v1/templates/from-survey/{survey_id}` default to `is_public: false` (team-scoped). Platform-provided templates in the `brand`, `cx`, and `employee` categories are public.

## Workflow example

A typical template-driven workflow:

1. **Browse** — "Show me CX templates" to see what is available
2. **Create** — "Create a survey from the CSAT template called Q2 Checkout Experience"
3. **Customize** — add project-specific questions, update option lists, configure skip logic
4. **Publish** — "Publish the survey" once customization is complete
5. **Save back** — "Save this survey as a template called Checkout Experience v2" to capture improvements for next quarter

## Next steps

- Build and customize survey content: [Build](/surveys-build)
- Manage survey lifecycle and versions: [Lifecycle & versioning](/surveys-lifecycle)
- Distribute to respondents: [Distribute](/surveys-distribute)


---

# Sample

Flashpoint.AI supports five ways to reach respondents. Each method creates a **panel** with a unique `panel_id`, so responses are segmented per source across collection, analysis, and export.

## Sampling methods

| Method | Respondents | When to use | Typical latency | Cost |
|---|---|---|---|---|
| **Synthetic** | AI personas with rich demographic and psychographic profiles | Hypothesis validation, concept testing, survey pre-flight, iterative design | Minutes | Included |
| **Prolific** | Real humans recruited from Prolific's opt-in participant pool | Academic research, UX studies, consumer surveys requiring defensible data | 24-48 hours | Per completion |
| **Dynata** | Real humans recruited from Dynata's first-party panel (220+ countries) | Large-scale market research, B2B studies, niche professional audiences | 2-7 days | Per completion |
| **Email list** | Real humans you already have contact information for | Customer satisfaction, employee engagement, beta-user feedback | Varies | Included |
| **Public link** | Anyone with the link | Social media distribution, website intercepts, open recruitment | Varies | Included |

## How panel_id works

Every sampling method produces a panel with its own `panel_id`. This identifier follows the data through the entire pipeline:

- **Collection** — responses are tagged with their panel source on ingestion. Synthetic responses are marked `source=synthetic` and never consume real-world quotas.
- **Analysis** — slice, filter, or compare results by panel. Ask *"show NPS by panel"* to see a column per source. Filter to a single panel or exclude one from a view.
- **Export** — the panel source appears as a column in CSV and PDF exports, so downstream consumers always know the provenance of each row.

You can run multiple panels against the same survey. A common pattern is to run a synthetic panel first for fast directional signal, then launch a Prolific or Dynata panel for defensible numbers, and compare the two distributions side by side.

## Choosing a method

Start by asking two questions:

1. **Do I need defensible data from real humans?** If yes, use Prolific (fast, academic-grade) or Dynata (large scale, B2B, multi-country). If directional signal is enough, start with synthetic.
2. **Do I already have contacts?** If yes, use an email list or public link. If you need to recruit from a population you don't have access to, use a panel provider.

For most studies, the fastest path is to iterate with synthetic, then scale with a real panel once the survey is stable. The platform makes it easy to compare panels side by side, so the two approaches complement each other rather than compete.

## Synthetic vs. real respondents

Synthetic panels answer in minutes and cost nothing beyond platform access. They are ideal for iteration — draft a survey, run 30 synthetics, spot problems, fix, repeat. Real panels (Prolific, Dynata) take hours to days and charge per completion, but produce data from verified human respondents that meets publication and compliance standards.

The recommended workflow for high-stakes studies:

1. **Iterate with synthetic** — validate wording, logic, and routing.
2. **Calibrate with a small real cohort** — run 30-50 real respondents alongside a matched synthetic panel.
3. **Compare distributions** — see where synthetic tracks real for your audience and where it diverges.
4. **Scale with confidence** — launch the full real panel once calibration looks good.

## Quick start

The fastest way to see sampling in action:

1. Create a survey in chat: *"Build a 5-question survey on coffee preferences."*
2. Create a synthetic panel: *"Create a panel of 20 US coffee drinkers ages 25-45."*
3. Field it: *"Have the panel take the survey."*
4. Analyze: *"Show me the top takeaways."*

All four steps complete in under five minutes. When you are ready for real respondents, swap step 2 for *"Quote 100 Prolific respondents, US, ages 25-45"* and follow the approval flow.

## Sub-pages

Each method has its own detailed page:

- [Synthetic](/sample-synthetic) — AI personas, persona model, the instant-insight loop, and when to use synthetic.
- [Prolific](/sample-prolific) — targeting filters, the quote-to-launch flow, and API examples.
- [Dynata](/sample-dynata) — Samplify integration, project-based model, and HMAC-signed redirects.
- [Cint](/sample-cint) — exchange model, target groups, and sample at scale across 130+ markets.

## Related

- [Surveys](/surveys) — build something for your panel to take.
- [Distribute](/surveys-distribute) — email lists and public links.
- [Analyze](/surveys-analyze) — slice results by panel source.


---

# Synthetic

Synthetic respondents are AI-generated personas that take a survey end to end. Each persona has a rich profile — demographics, personality, values, behaviors, brand affinities — and answers every question in character. Responses land in the same data store as real responses, tagged with `source=synthetic` so you can include them, exclude them, or compare them per analysis.

Synthetic panels are account-scoped and reusable. Build a panel once, run it against as many surveys as you want over weeks or months.

## What you can do with it

| Use case | What it gets you |
|---|---|
| **Validate a hypothesis** | Run 30 synthetics against your most controversial hypothesis. If the signal isn't there even directionally, rewrite the question before spending on real respondents. |
| **Concept testing** | Run three product copy variants past the same panel and compare the relative lift. |
| **Pre-flight a study** | See the shape of the data before you pay for real respondents. Spot leading wording, routing dead-ends, or missing answer options in minutes. |
| **Longitudinal cohorts** | One panel, multiple surveys over time. Run a 20-person "EV-curious US drivers" panel against your Q1 study, then your Q2 follow-up — same personas, comparable answers. |
| **Calibrate against real** | Run the same survey against a synthetic panel and a paid Prolific cohort. Compare distributions to learn where synthetic tracks real for your audience. |

## How a persona is built

When you create a synthetic panel, each persona materializes with a full profile. The persona simulator draws from four layers:

### Demographics

Age, gender, location, education, income bracket, occupation, marital status, children, ethnicity.

### Psychographics

Personality traits, values, interests, lifestyle.

### Behaviors

Media consumption habits, shopping behavior, tech adoption patterns, and brand loyalty and affinities.

### Survey traits

Survey attitude (engaged, skeptical, or rushed) and trust level. These shape how the persona responds — a skeptical persona leaves shorter open-ends and is more likely to pick neutral scale points, mirroring real respondent variance.

You do not author these fields by hand. Describe the audience in plain language — *"tech-forward US millennials who own at least one EV"* — and the platform fills in the profile. The richer your description, the more coherent the personas.

## Grounding in real demographic data

For higher fidelity, ground a panel in real population distributions. Ask for demographic data on any geography — *"give me demographics for Austin, TX"* — and pass that context into panel creation. Personas are then generated with distributions that track the real population for that location.

This is useful whenever you want a panel to mirror a real place (a US state, a metro area, a country) rather than a hand-described audience segment.

## The instant-insight loop

A typical session looks like this:

```
1. Create a survey                            (seconds)
2. Create a synthetic panel                   (seconds -- personas materialize)
3. Have the panel take the survey             (minutes -- responses stream in)
4. Analyze as data lands                      (live -- charts update per response)
5. Iterate                                    (edit the survey or spin up another panel)
```

Steps 3 and 4 overlap. The analysis surface updates as each persona finishes. By the time the cohort is done, your analysis is already done.

## Typical workflow

| Round | What you do |
|---|---|
| **1** | Draft survey, run 20-30 synthetics, look at where responses cluster oddly or break. Fix the survey. |
| **2** | Re-run 50 synthetics with the cleaned survey. Read directional signal across your hypotheses. |
| **3** | Adjust. Optionally create a second panel with a different profile to compare two audiences. |
| **4** | If the signal is strong and you need defensible numbers, launch a paid Prolific or Dynata cohort. Compare against your synthetics to validate. |

Most exploratory work stops at round 2 or 3. Round 4 matters when you need to publish headline numbers to an external audience.

## Agent prompts

Drive the whole flow from chat. The agent creates, fields, and analyzes without requiring you to manage IDs or navigate menus.

**Create a panel:**

> *Create a synthetic panel of 20 tech-forward US millennials who own EVs.*

**Create a survey and field it:**

> *Create a 5-question survey on charging-station preferences, then have the panel take it.*

**Analyze results:**

> *Give me the top 3 takeaways from the synthetic run.*

**Reuse a panel across surveys:**

> *Have my EV-owners panel take this new survey.*

**Compare against real respondents:**

> *Now launch 30 Prolific respondents on the same survey and show me NPS by panel.*

The agent reuses the panel and survey from context — you do not need to repeat IDs or names.

## How synthetic responses are ingested

Synthetic responses are submitted via an internal service-token-authenticated endpoint. Each response carries:

- **`data`** — answers keyed by question label (e.g., `{"Q1": "1", "Q2": "3"}`).
- **`persona`** — the full persona profile stored as `respondent_metadata`.
- **`status`** — `COMPLETE` or `INCOMPLETE`.
- **`panel_id`** — the synthetic panel UUID, used for segmentation in analysis.

Every row is written with `source=synthetic` and `accounted=False`. Synthetic responses never consume real-world quotas. The analytics toggle controls visibility, not this bookkeeping flag.

Synthetic responses are allowed on **draft** surveys — the whole point is to validate a survey before it goes live. No rate limiting, no IP capture, no fraud checks (those belong on the real-respondent pipeline).

## Comparing synthetic vs. real

Every response carries a panel identifier. Analysis lets you slice and compare:

- **Stack panels in one crosstab** — *"show NPS by panel"* returns a column per panel (your synthetic cohort, your Prolific cohort, your email list).
- **Filter to one** — *"show me just the synthetic responses"* or *"exclude synthetic from this view."*
- **Validate fidelity** — run the same survey against a small paid cohort and a same-size synthetic cohort. Closed-ended distributions typically land within a few points; open-ends read differently in voice but cluster into the same themes.

### The calibration loop

We recommend this the first time a team uses synthetic for a real study:

1. Run a small paid cohort (30-50 respondents) alongside a same-size synthetic cohort.
2. Compare where the distributions converge and where they diverge.
3. Decide whether the divergence matters for your decision.

This builds team-level confidence in when synthetic signal is trustworthy for your domain.

## When to use synthetic

Synthetic is the right tool for:

- Exploratory research where directional signal is enough.
- Validating hypotheses before committing budget to real respondents.
- Concept tests and A/B copy comparisons.
- Pressure-testing a questionnaire's logic, wording, and routing.
- Longitudinal use of the same persona cohort across multiple studies.

## When not to use synthetic

Synthetic is **not** the right tool for:

- Regulated audiences (clinical research, financial-services compliance) where respondent provenance is required.
- Very narrow niches where the underlying model has limited signal — verify with a small real-cohort calibration first.
- Tracker studies requiring real-respondent statistical consistency over time.
- Headline numbers published to an external audience without context.

The platform always tags synthetic responses. You decide where the line is for your study.

## Limits

- **Cohort size** — panels of 20-50 personas are typical for fast iteration. Larger cohorts are supported and take proportionally longer.
- **Survey length** — every persona answers the whole survey in one pass. Very long surveys (50+ questions with many open-ends) take longer to field.
- **Screen-outs reduce surviving count** — synthetic generates one response per persona. If a screener filters out half, half of your panel remains in analysis. Plan panel size with expected qualification rate in mind.

## Next steps

- [Surveys](/surveys) — build something for your panel to take.
- [Prolific](/sample-prolific) — recruit real human respondents.
- [Analyze](/surveys-analyze) — see how synthetic responses sit alongside real ones.


---

# Prolific

Prolific is a participant recruitment platform used widely in academic research, UX studies, and market research. Flashpoint.AI integrates with the Prolific Researcher API to let you recruit real human respondents directly from chat or via the API. Respondents are pre-verified Prolific participants who opt in and are paid per completion.

## How it works

Prolific uses a **study-based model**. When you launch a panel, Flashpoint.AI creates a Prolific study with your targeting filters, reward amount, and survey URL. Prolific routes eligible participants to your survey. When a respondent finishes, Prolific marks them as complete and handles payment automatically.

Authentication between the respondent and your survey is handled via URL parameters (`PROLIFIC_PID`, `SESSION_ID`, `STUDY_ID`) that Prolific appends to the survey link. Completion uses unique per-study codes — Flashpoint.AI generates a fresh code for each study so respondents cannot reuse codes across studies.

## Targeting filters

Prolific supports a rich set of demographic filters. The platform translates human-readable values (like `"female"` or `"California"`) into Prolific's internal ChoiceID format automatically. You can pass any of the canonical values shown below, or common aliases (e.g., `"M"` for male, `"CA"` for California).

### Standard demographic filters

| Filter key | Format | Description |
|---|---|---|
| `country` | ISO 3166-1 alpha-2 | Country of residence. Drives currency and regional pool availability. |
| `age_min` / `age_max` | Integer (18-100) | Age range. Both are optional; omit one for an open-ended range. |
| `sex` | Enum | Biological sex. |
| `ethnicity` | Enum | Self-identified ethnicity. Multi-select supported. |
| `language` | Enum | First language. |
| `education` | Enum | Highest education level completed. |
| `employment_status` | Enum | Current employment situation. |
| `employment_sector` | Enum | Industry or sector of current employment. |
| `household_income_usd` | Enum | Annual household income (US participants only). |
| `marital_status` | Enum | Relationship or marital status. |
| `has_children` | Enum | Whether the participant has children. |
| `student_status` | Enum | Whether the participant is a current student. |
| `nationality` | ISO 3166-1 alpha-2 | Country of citizenship. |
| `us_state` | Enum | US state of residence. Requires `country=US`. |
| `us_region` | Enum | US census region (coarser than `us_state`). |

### Canonical values

**sex:** `male`, `female`

**ethnicity:** `african`, `black/african american`, `caribbean`, `east asian`, `latino/hispanic`, `middle eastern`, `mixed`, `native american or alaskan native`, `south asian`, `white`, `other`, `white sephardic jew`, `black/british`, `white mexican`, `romani/traveller`, `south east asian`, `rather not say`

**education:** `no formal qualifications`, `secondary education (e.g. ged/gcse)`, `high school diploma/a-levels`, `technical/community college`, `undergraduate degree (ba/bsc/other)`, `graduate degree (ma/msc/mphil/other)`, `doctorate degree (phd/other)`, `don't know / not applicable`

**employment_status:** `full-time`, `part-time`, `due to start a new job within the next month`, `unemployed (and job seeking)`, `not in paid work (e.g. homemaker', 'retired or disabled)`, `other`

**employment_sector:** `agriculture, food and natural resources`, `architecture and construction`, `arts`, `business management & administration`, `education & training`, `finance`, `government & public administration`, `medicine`, `hospitality & tourism`, `information technology`, `legal`, `policing`, `military`, `manufacturing`, `marketing & sales`, `retail`, `science, technology, engineering & mathematics`, `social sciences`, `transportation, distribution & logistics`, `other`, `rather not say`

**household_income_usd:** `less than $10000`, `$10000-$15999`, `$16000-$19999`, `$20000-$29999`, `$30000-$39999`, `$40000-$49999`, `$50000-$59999`, `$60000-$69999`, `$70000-$79999`, `$80000-$89999`, `$90000-$99999`, `$100000-$149999`, `more than $150000`

**marital_status:** `single`, `in a relationship`, `engaged`, `married`, `widowed`, `divorced`, `separated`, `never married`, `rather not say`, `in a civil partnership/civil union or similar`

**has_children:** `yes`, `no`

**student_status:** `yes`, `no`

**us_region:** `midwest`, `northeast`, `south`, `west`

**us_state:** All 50 states plus Washington DC. Accepts full name (`California`), USPS abbreviation (`CA`), or combined form (`California (CA)`).

**country:** 40+ countries by ISO-2 code, including `US`, `GB`, `DE`, `FR`, `ES`, `AU`, `CA`, `IN`, `JP`, `BR`, `MX`, `NL`, `SE`, `CH`, `SG`, `NZ`, `ZA`, and more. Full names (`United States`, `Germany`) are also accepted.

### Attribute search for niche targeting

Standard filters cover demographics. For niche targeting — smartphone OS, brand affinity, pet ownership, political ideology, dietary preferences — use the attribute search. Prolific exposes approximately 150 filters in their full catalog. **This is an agent-only operation** — there is no public REST endpoint. The surveys agent queries the catalog by natural language and returns the vendor's own filter IDs and option IDs, which you pass directly into the `attributes` parameter on quote and submit.

**Agent prompt:**

> *Search Prolific for "smartphone os" filters.*

The agent returns matches with `attribute_id` and `options` that go directly into `attributes` on the quote request.

## The full flow

### Step 1: List available providers

Discover which panel providers are configured for your team.

**Agent prompt:**

> *What panel providers do we have?*

**API call:**

```bash
curl https://api.flashpoint.ai/api/v1/panels/providers \
  -H "Authorization: Bearer $TOKEN"
```

### Step 2: Check targeting filters

Before quoting, see what filters Prolific supports and which values each accepts. **This is an agent-only operation** — Prolific filters are surfaced through the surveys agent (not a public REST endpoint). For Dynata, the equivalent catalog is exposed at `GET /api/v1/panels/dynata/attributes`.

**Agent prompt:**

> *Show me what Prolific filters are available.*

### Step 3: Get a quote

Request price and feasibility without committing money. Returns cost per completion, total cost, estimated availability, and warnings if the pool is too small.

**Agent prompt:**

> *Quote 200 US women ages 25-44 on Prolific for the sneaker survey.*

**API call:**

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/panels/quote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "PROLIFIC_PROVIDER_UUID",
    "sample_size": 200,
    "country": "US",
    "targeting": {
      "sex": "female",
      "age_min": 25,
      "age_max": 44
    }
  }'
```

**Response shape:**

```json
{
  "feasible": true,
  "estimated_completes": 200,
  "estimated_days": 2,
  "cost_per_complete": "2.45",
  "total_cost": "490.00",
  "currency": "USD",
  "warnings": []
}
```

### Step 4: Approve and pay

Once you review the quote, approve the launch. Payment is collected via Stripe inline in the chat UI.

**Agent prompt:**

> *Looks good, launch it.*

The agent calls `request_panel_payment`, which renders a Stripe payment panel inline. Nothing is charged until you complete payment in that panel.

**The study is not published automatically.** Once payment clears, the buy is parked as paid-and-ready and our operations team tops up the Prolific account balance and publishes the study. Your panel card shows the buy as live from the moment payment clears; recruiting begins when the study is published, typically within a few hours during working hours.

### Step 5: Monitor status

Check live progress — completes, starts, in-progress, disqualified, and over-quota counts — directly from Prolific's API.

**Agent prompt:**

> *How's the Prolific panel doing?*

**API call:**

```bash
curl https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/panels/$INTEGRATION_ID/status \
  -H "Authorization: Bearer $TOKEN"
```

**Response shape:**

```json
{
  "status": "active",
  "completes": 142,
  "starts": 178,
  "in_progress": 12,
  "disqualified": 24,
  "over_quota": 0
}
```

### Step 6: Pause and resume

Temporarily halt recruiting (e.g., to check responses before continuing) without closing the study.

**Agent prompts:**

> *Pause the Prolific panel for now.*

> *Resume recruiting on Prolific.*

## Pricing

Prolific charges per completion. **The figure in your quote is the final, all-in cost per complete** — nothing is added at invoice.

What drives it:

- **Length of interview.** The participant reward is derived from LOI against Prolific's hourly rate floor, so a longer survey costs more per complete. You can specify a custom reward if you want to pay above the floor to fill faster.
- **Audience.** Harder-to-reach audiences need a higher reward to fill.
- **Screen-outs.** Disqualified respondents receive a small fixed payment, which is included in the quote.

## Rate limiting

Prolific enforces rate limits on their API. Flashpoint.AI handles `429 Too Many Requests` responses automatically with exponential backoff and `Retry-After` header support. You do not need to manage rate limiting yourself.

## Next steps

- [Dynata](/sample-dynata) — an alternative panel provider for large-scale and B2B research.
- [Synthetic](/sample-synthetic) — run AI personas first to pre-flight your survey.
- [Analyze](/surveys-analyze) — compare Prolific results against synthetic or other panels.


---

# Dynata

Dynata (formerly Research Now SSI) is the world's largest first-party data and insights platform, with access to respondents across 220+ countries. Flashpoint.AI integrates with Dynata's Samplify API to let you recruit real human respondents for large-scale market research, B2B studies, and niche professional audiences.

## How it works

Dynata uses a **project-based model**. When you launch a panel, Flashpoint.AI creates a Samplify project with a line item that specifies your targeting (as a quota plan), sample size, length of interview, and incidence rate. Dynata handles respondent routing, qualification, and payment on their side.

Respondent tracking uses Dynata's `[%RID%]` placeholder system. When a respondent finishes the survey, Flashpoint.AI redirects them to Dynata's exit endpoint with an HMAC-SHA256-signed URL that encodes the outcome (complete, screen-out, or quota full). This signature lets Dynata verify the redirect originated from Flashpoint.AI.

## Key differences from Prolific

| Dimension | Prolific | Dynata |
|---|---|---|
| **Model** | Study-based | Project-based with line items |
| **Feasibility** | Pre-project eligibility count | Requires a draft project — no pre-project feasibility endpoint |
| **Auth** | Token header (`Token <key>`) | Password grant against Samplify auth endpoint |
| **Targeting format** | Filter ID + selected values | Quota plan with attribute IDs and option IDs |
| **Redirect security** | Completion codes (per-study unique) | HMAC-SHA256 signed exit URLs |
| **Typical latency** | 24-48 hours | 2-7 days |
| **Best for** | Academic, UX, consumer surveys | Large-scale MR, B2B, multi-country |

## Targeting

Dynata targeting uses Samplify attribute IDs. The platform translates canonical keys (like `sex`, `age_range`, `education`) into the Dynata wire format automatically.

### Standard targeting keys

| Key | Attribute ID | Format | Description |
|---|---|---|---|
| `sex` / `gender` | 11 | Enum: `male`, `female` | Biological sex. |
| `age` | 13 | Integer (18-99) | Minimum age. |
| `age_range` | 13 | Range string, e.g. `"25-34"` | Age range. |
| `household_income_usd` | 14 | Samplify reference | Annual household income. |
| `education` | 15 | Samplify reference | Highest education level. |
| `employment_status` | 16 | Samplify reference | Current employment. |
| `marital_status` | 17 | Samplify reference | Relationship status. |
| `ethnicity` / `race` | 18 | Samplify reference | Self-identified ethnicity. |
| `us_zip` / `zip` | 19 | 5-digit string | US ZIP code. |
| `us_state` | 20 | USPS code or full name | US state of residence. |
| `us_region` | 21 | Census region name | US census region. |

Keys marked "Samplify reference" accept locale-specific values from Dynata's reference data API. For the `sex` / `gender` key, the platform handles the translation (`male` maps to option `1`, `female` to option `2`). All other keys pass values through as strings to Samplify.

### Attribute search for niche targeting

Dynata's full attribute catalog spans thousands of entries organized into 14 categories: Demographic, Automotive, Leisure/Interests, Entertainment, Travel, Finance, Household, Electronics, Shopping, Food/Beverages, Utilities, Region, Political, and B2B.

Use the attribute search to find targeting options beyond standard demographics. **This is an agent-only operation** — there is no public REST endpoint. The surveys agent runs the search against Dynata's catalog and returns the matches inline.

**Agent prompt:**

> *Search Dynata for vehicle ownership attributes.*

The agent returns matches that include the vendor's own `attribute_id` and `options`. Pass these directly into the `attributes` parameter on quote and submit — no translation needed.

```json
{
  "matches": [
    {
      "attribute_id": "8421",
      "name": "Vehicle Ownership",
      "category": "AUTOMOTIVE",
      "options": [
        {"id": "1", "label": "Own"},
        {"id": "2", "label": "Lease"},
        {"id": "3", "label": "Neither"}
      ]
    }
  ]
}
```

### Survey topics

Dynata uses a topic taxonomy to route respondents. The default topic is `BUSINESS`. You can override it via the `config` parameter if your survey falls under a different category (e.g., `HEALTHCARE`, `AUTOMOTIVE`, `FINANCE`).

## The full flow

The flow follows the same shape as Prolific: list providers, check filters, quote, approve and pay, monitor, pause/resume.

### Step 1: Get a quote

Dynata's feasibility check requires creating a draft project on Samplify (there is no pre-project feasibility endpoint). Flashpoint.AI handles this automatically — the draft project is free and auto-expires. The platform polls Samplify for the feasibility result with exponential backoff, since Dynata returns a `PROCESSING` status while computing.

**Agent prompt:**

> *Quote 500 US respondents on Dynata for the brand tracker, ages 25-54.*

**API call:**

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/panels/quote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "DYNATA_PROVIDER_UUID",
    "sample_size": 500,
    "country": "US",
    "targeting": {
      "age_range": "25-54"
    },
    "loi_minutes": 12
  }'
```

**Response shape:**

```json
{
  "feasible": true,
  "estimated_completes": 500,
  "estimated_days": 5,
  "cost_per_complete": "4.20",
  "total_cost": "2100.00",
  "currency": "USD",
  "warnings": []
}
```

If Dynata's feasibility engine is still computing when the retry budget is exhausted (~40 seconds), the response returns with a warning and `feasible: false`. Retry in a moment.

### Step 2: Use niche attributes in the quote

Combine standard targeting with vendor-direct attributes from the search catalog.

**Agent prompt:**

> *Quote 300 US iPhone users aged 18-34 on Dynata.*

**API call:**

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/panels/quote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "DYNATA_PROVIDER_UUID",
    "sample_size": 300,
    "country": "US",
    "targeting": {
      "age_range": "18-34"
    },
    "attributes": [
      {"attribute_id": "8421", "options": ["1"]}
    ]
  }'
```

Multiple attribute entries are AND-ed together. Within one entry, multiple options are OR-ed. Add `"operator": "exclude"` to negate an attribute.

### Step 3: Approve and pay

Same Stripe inline payment flow as Prolific. **The project is not launched automatically.** Once payment clears, the buy is parked as paid-and-ready and our operations team launches it after a sanity check — on the Samplify side that is a `POST /sample/v1/projects/{id}/buy` call moving the project from draft to fielding.

The human gate is deliberate: a launched project draws real panelists immediately, and a misconfigured launch cannot be undone. Your panel card shows the buy as live from the moment payment clears.

**Agent prompt:**

> *Approve the Dynata panel and launch.*

### Step 4: Monitor status

Check live progress from Dynata's stats endpoint.

**Agent prompt:**

> *How's the Dynata panel doing?*

**Response shape:**

```json
{
  "status": "active",
  "completes": 312,
  "starts": 405,
  "disqualified": 67,
  "over_quota": 26
}
```

### Step 5: Pause and resume

Pause halts respondent flow. Resume reactivates the project.

**Agent prompts:**

> *Pause the Dynata panel.*

> *Resume recruiting on Dynata.*

## How the quota plan works

Dynata's targeting is expressed as a **quota plan** — a nested structure of quota groups, cells, and nodes. When you provide a flat targeting dict (e.g., `{"sex": "male", "age_range": "25-34"}`), Flashpoint.AI collapses all conditions into a single quota cell with the specified sample size.

For split quotas (e.g., 50% male / 50% female), the platform converts Flashpoint.AI's Quota database records into multi-cell quota plans via the quota mapper. Each cell specifies its own count and conditions.

**Wire format example (single cell):**

```json
{
  "filters": [],
  "quotaGroups": [
    {
      "name": "Targeting",
      "quotaCells": [
        {
          "quotaCellId": "default",
          "count": 500,
          "quotaNodes": [
            {
              "attributeId": "11",
              "options": ["1"],
              "operator": "include"
            },
            {
              "attributeId": "13",
              "options": ["25-34"],
              "operator": "include"
            }
          ]
        }
      ]
    }
  ]
}
```

An empty quota plan (`{}`) means general population with no filtering.

## HMAC-signed redirect URLs

When a respondent finishes (or is disqualified, or hits quota full), Flashpoint.AI redirects them to Dynata's exit endpoint at `api.dynata.com/respondent/exit`. Each redirect URL includes:

| Parameter | Purpose |
|---|---|
| `rst` | Result status: `1` = complete, `2` = screen out, `3` = quota full |
| `psid` | Respondent ID (Dynata substitutes `[%RID%]` at runtime) |
| `_o` | Flashpoint.AI's project ID |
| `_k` | Security key ID |
| `_s` | HMAC-SHA256 signature over the path and query string |

The signature lets Dynata verify that the redirect originated from Flashpoint.AI and was not tampered with. If signing keys are not configured, URLs are generated unsigned (acceptable for development, logged as a warning in production).

## Reference data

Dynata's attribute catalog, country list, and survey topic taxonomy are all locale-specific and fetched from Samplify's reference data API. Flashpoint.AI caches this data for one hour. The attribute catalog is paginated and deduplicated — only attributes marked `isAllowedInQuotas=true` are surfaced.

## Next steps

- [Prolific](/sample-prolific) — an alternative panel provider for academic and UX research.
- [Synthetic](/sample-synthetic) — pre-flight your survey with AI personas before spending on real respondents.
- [Analyze](/surveys-analyze) — compare Dynata results against other panel sources.


---

# Cint

Cint (Cint Exchange, formerly Lucid Marketplace) is a programmatic sample exchange connecting buyers to hundreds of supplier panels across 130+ markets. Flashpoint.AI integrates with the Cint Demand API to let you buy sample at exchange scale — large multi-country studies, low-incidence audiences, and markets where a single panel can't fill on its own.

## How it works

Cint uses an **exchange model**: account → business unit → project → target group → fielding run. The target group is the unit that matters — it carries your targeting, quotas, sample size and price, and it's what fields. The project above it is a thin container.

When you launch a panel, Flashpoint.AI creates a project and a draft target group with your audience expressed as Cint profiling conditions. Cint routes respondents from whichever supplier panels match. Because a live target group draws real panelists from many suppliers at once, launching is a deliberate step — see [Approve and launch](#step-4-approve-and-launch).

Respondent tracking uses Cint's `rid` parameter. When a respondent finishes, Flashpoint.AI reports the outcome **server-to-server** and redirects the browser as confirmation.

## Key differences from Prolific and Dynata

| Dimension | Prolific | Dynata | Cint |
|---|---|---|---|
| **Model** | Study | Project + line items | Project + target group + fielding run |
| **Auth** | Token header | Password grant | OAuth2 client credentials |
| **Feasibility** | Eligibility count | Draft project required | `calculate-feasibility` on the target group |
| **Pricing** | We set the reward | Rate card | Rate card; Cint also returns a suggested price |
| **Quota model** | No vendor quotas | Quota cells with counts | Quota cells as **percentages** |
| **Launch** | Async, polled job | Buy call | Async, polled job |
| **Status delivery** | Completion codes | Signed exit URLs | **S2S** + RIS redirect codes |
| **Best for** | Academic, UX, consumer | Large-scale MR, B2B | Multi-country, low incidence, high volume |

## Targeting

Cint targeting is expressed as profiling conditions against question IDs. Flashpoint.AI translates canonical keys into Cint's `profiles[].conditions[]` format automatically.

### Standard targeting keys

| Key | Question ID | Format | Description |
|---|---|---|---|
| `gender` | 43 | Enum | Biological sex. |
| `age` | 42 | Range — pass `age_min` / `age_max` | Age range (1–99). |
| `zip` | 45 | String or list | US ZIP codes. Up to 10,000 entries. |
| `hispanic` | 47 | Enum | Hispanic / Latino origin. |
| `ethnicity` | 113 | Enum | Self-identified ethnicity. |
| `household_income_us` | 14785 | Enum | Annual household income (US). |
| `employment_status` | 2189 | Enum | Current employment situation. |
| `education` | 48741 | Enum | Highest education completed. |
| `marital_status` | 632 | Enum | Relationship status. |
| `household_composition` | 641 | Enum | Total people in household. |
| `parental_status` | 7064 | Enum | Whether the respondent has children. |

Question IDs are global and stable across locales — only the question text translates.

### Canonical values

**gender:** `male`, `female`

Cint's gender question has exactly two options. There is no non-binary code on question 43; a request for one surfaces as a warning rather than silently mistargeting.

**hispanic:** `yes`, `no`, plus specific origins — `mexican`, `puerto_rican`, `cuban`, `argentina`, `colombia`, `ecuador`, `el_salvador`, `guatemala`, `nicaragua`, `panama`, `peru`, `spain`, `venezuela`, `other_hispanic`, `prefer_not_to_answer`

This is an origin question, not a yes/no. Passing `yes` targets the union of every affirmative origin.

**ethnicity:** `white`, `black_or_african_american`, `native_american_or_alaska_native`, `asian_indian`, `chinese`, `filipino`, `japanese`, `korean`, `vietnamese`, `native_hawaiian`, `guamanian`, `samoan`, `other_pacific_islander`, `some_other_race`, `other`, `prefer_not_to_answer`

**household_income_us:** `lt_5k`, `5k_to_9k`, `10k_to_14k`, `15k_to_19k`, `20k_to_24k`, `25k_to_29k`, `30k_to_34k`, `35k_to_39k`, `40k_to_44k`, `45k_to_49k`, `50k_to_54k`, `55k_to_59k`, `60k_to_64k`, `65k_to_69k`, `70k_to_74k`, `75k_to_79k`, `80k_to_84k`, `85k_to_89k`, `90k_to_94k`, `95k_to_99k`, `100k_to_124k`, `125k_to_149k`, `150k_to_174k`, `175k_to_199k`, `200k_to_249k`, `250k_and_above`, `prefer_not_to_answer`

**employment_status:** `employed_full_time`, `employed_part_time`, `self_employed_full_time`, `self_employed_part_time`, `active_military`, `inactive_military_veteran`, `temporarily_unemployed`, `between_jobs_looking_for_work`, `full_time_homemaker`, `bringing_up_a_family`, `unpaid_full_time_carer`, `working_unpaid`, `parental_leave`, `leave_of_absence`, `unable_to_work`, `disabled`, `retired`, `student`, `other_paid_work`, `pursuing_own_goals`, `prefer_not_to_answer`

**education:** `some_high_school_or_less`, `high_school_graduate`, `vocational_training`, `some_college_no_degree`, `associates_degree`, `bachelors_degree`, `masters_or_professional_degree`, `doctorate`, `none_of_the_above`

**marital_status:** `single_never_married`, `married`, `engaged`, `domestic_partnership`, `separated_divorced_or_widowed`, `prefer_not_to_answer`

**household_composition:** `1_person`, `2_persons`, `3_persons`, `4_persons`, `5_persons`, `6_or_more_persons`, `prefer_not_to_answer`

**parental_status:** `pregnant_or_expecting`, `has_minor_children`, `has_adult_children`, `no_children`

### Attribute search for niche targeting

The keys above are the demographics we translate locally. Cint's full profiling library is far larger and locale-specific, with option codes that differ per market. Use attribute search to reach it — the agent queries Cint's live `questions-translation` data and returns real question IDs and option codes you can pass straight through.

**Agent prompt:**

> *Search Cint for home ownership questions in the UK.*

## Markets and languages

Cint sells into far more locales than its feasibility engine can price in, and this is the most common source of confusion on international buys.

Two things to know:

**The `preferred` language flag is the market default, not the local language.** It reads `eng` for Pakistan. Target the language your survey is actually written in — a Pakistan study quoted in English succeeds and fields English speakers, which is a wrong answer with no error attached.

**A listed locale means Cint sells there, not that it can price there.** Uzbekistan is listed in three languages and priceable in none. Use the feasibility probe on a single country to find out which locales respond.

**Agent prompt:**

> *What languages can Cint actually field in Kazakhstan?*

**API call:**

```bash
curl https://api.flashpoint.ai/api/v1/panels/cint/locales \
  -H "Authorization: Bearer $TOKEN"
```

## The full flow

### Step 1: Check targeting filters

```bash
curl https://api.flashpoint.ai/api/v1/panels/cint/filters \
  -H "Authorization: Bearer $TOKEN"
```

### Step 2: Get a quote

Feasibility and price come from the same Cint call. The response carries a suggested completes range and a suggested price per complete.

**Agent prompt:**

> *Quote 500 US adults 25-54, household income $75k+, on Cint.*

**API call:**

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/panels/quote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "CINT_PROVIDER_UUID",
    "sample_size": 500,
    "country": "US",
    "targeting": {
      "age_min": 25,
      "age_max": 54,
      "household_income_us": ["75k_to_79k", "80k_to_84k", "85k_to_89k"]
    }
  }'
```

If Cint's feasibility engine doesn't model the locale you asked for, the quote says so explicitly rather than reporting zero availability.

### Step 3: Review the draft

Before any charge, Flashpoint.AI re-reads the draft target group from Cint and verifies the profiling conditions actually landed. Cint's read endpoint lags writes by a second or two, so this check retries before it blocks.

### Step 4: Approve and launch

Payment is collected via Stripe inline in chat. **The target group is not launched automatically.** Once payment clears, the buy is parked as paid-and-ready and our operations team launches it from the Cint Exchange after a sanity check.

This is deliberate. A launched target group draws real panelists from live supplier panels within seconds, and an unreviewed launch is expensive in a way that can't be undone — a misconfigured test buy once sent 353 real prescreens to the wrong survey URL before Cint auto-paused it for poor conversion.

Your panel card shows the buy as live from the moment payment clears. Status flips to actively fielding when the target group starts.

### Step 5: Monitor status

**Agent prompt:**

> *How's the Cint panel doing?*

**Response shape:**

```json
{
  "status": "active",
  "completes": 418,
  "starts": 1240,
  "disqualified": 762,
  "over_quota": 60
}
```

### Step 6: Pause and resume

**Agent prompts:**

> *Pause the Cint panel.*

> *Resume recruiting on Cint.*

## How quotas work

Cint's quota model is **percentage-based**, unlike Dynata's counts. Flashpoint.AI translates your survey's quota records into Cint target cells, converting counts to percentages of the requested sample size.

Not everything translates, and what doesn't is reported as a warning rather than dropped silently:

| Quota type | Fields on Cint? |
|---|---|
| Gender, age range, standard demographic labels | Yes |
| The overall total | No — that's the sample size itself |
| Quotas on your own survey questions | No — Cint doesn't know your questionnaire |
| Interlocked quotas (age **and** gender in one cell) | Not yet — needs Cint blended profiles |

Anything that doesn't field on Cint is still enforced on our side at survey time, so your quota targets hold either way. The difference is efficiency: a split Cint can't field means respondents reach your survey and get screened out as over-quota, which wastes exchange sample and bounces panelists.

## Status delivery and redirects

Cint is the one provider where we report outcomes **server-to-server** rather than relying on the browser.

On finish, Flashpoint.AI posts the final status to Cint's fulfillment API and then redirects the respondent as confirmation. S2S is the more robust path — a browser redirect can be lost, blocked, or spoofed, and losing one means a ghost complete.

Redirect outcomes use Cint's RIS client status codes:

| Outcome | RIS code |
|---|---|
| Complete | `10` |
| Terminate (screener or survey logic) | `20` |
| Quality terminate | `30` |
| Over-quota | `40` |

Over-quota is reported as `40`, never collapsed into `20` — Cint prices and paces on the distinction. Code `30` is reserved for genuine data-quality failures: it affects panelist reputation scores and can trigger supplier disputes, so an ordinary terminate never uses it.

## Reference data

Cint's profiling library, locale list, and option codes are fetched live from the Demand API and cached. Question IDs are stable across locales; option codes and question text are not, so niche targeting is resolved per market through attribute search rather than from a static map.

## Next steps

- [Prolific](/sample-prolific) — academic and UX research, smaller and faster.
- [Dynata](/sample-dynata) — large-scale and B2B research with a deep attribute taxonomy.
- [Synthetic](/sample-synthetic) — pre-flight your survey with AI personas before spending on real respondents.
- [Data quality](/data-quality) — fraud and quality screening applied to every panel source.


---

# Become a sample partner

Flashpoint.AI buys sample on behalf of research teams running studies across consumer, B2B and international markets. If you operate a panel, a router, an exchange, or a community you recruit from, this section covers how to connect.

There are two ways in, and the right one depends on how much traffic we expect to run together — not on how sophisticated your API is.

## Which path is yours

| | **Send us traffic** | **Integrate your API** |
|---|---|---|
| **Time to first respondent** | Under an hour | 2–4 weeks |
| **Who builds** | Nobody — it's configuration | Our engineering team |
| **What you provide** | Five return URLs | API docs, credentials, a staging environment |
| **How a buyer targets you** | Agreed per project, off-platform | Directly, from our targeting UI |
| **Quota enforcement** | Ours, and yours if you have it | Ours, pushed to you where your API supports it |
| **Pricing** | Agreed per project | Quoted or offered in-app, per your model |
| **How buyers see you** | A named sample source on their study | A provider in the panel picker |
| **Best for** | Most partners. Pilots, regional panels, client communities, anything bespoke | Panels we expect to field continuously, at volume |

**Start with "send us traffic" unless we've already agreed otherwise.** It is live the same day, it proves the commercial fit, and nothing about it blocks a deeper integration later.

→ **[Send us traffic](/partners-send-traffic)** — the link contract, start to finish
→ **[Integrate your API](/partners-api-integration)** — what we need, and how the project runs

## What we do on our side

Whichever path you take, the same things are true:

**We screen before your respondent starts.** Every entrant passes fraud and duplicate detection (Research Defender) before they reach a question. A blocked respondent is returned to you immediately on a dedicated leg, not silently dropped — so you can replace them, and you aren't billed for traffic we were never going to accept.

**We report five outcomes, not two.** Complete, screen-out, over-quota, quality and security each get their own return leg. Over-quota in particular never collapses into screen-out: they are commercially different events, and merging them corrupts incidence on both sides of the trade.

**We don't invent quality flags.** A quality or security return means we hold an actual signal. Our ordinary terminates come back as ordinary terminates, because a wrongly-flagged panelist carries a reputation cost we're not entitled to impose.

**Respondents get a real survey.** Studies are checked before they field — logic, routing, mobile layout, length — so your panelists aren't the ones discovering a broken page.

## How a partnership starts

1. **Email [developers@flashpoint.ai](mailto:developers@flashpoint.ai)** with your coverage: markets, approximate panel size, categories you can reach, and anything distinctive. If you have API documentation, send it.
2. **We reply within two working days** — either with a commercial conversation, or with a specific gap analysis against the [API requirements](/partners-api-integration) if you're on that path.
3. **Commercial terms and a DPA** before any live traffic.
4. **Configuration or build**, per the path above.
5. **Certification** — a joint walk-through on a test study before anything goes live.

## Next steps

- [Send us traffic](/partners-send-traffic) — the fastest path, live today
- [Integrate your API](/partners-api-integration) — the full integration
- [Data quality](/data-quality) — what we screen for, and how


---

# Send us traffic

The fastest way to field with us. No API work on your side — you receive an entry link, you send respondents to it, and we return them to you with an outcome. Most partners are live within the hour.

You do not call our API for this. Everything below is a link contract: one URL you receive, five URLs you provide.

## What you need to provide

Two things: some commercial basics, and five return URLs. No API work either side.

### Commercial basics

Send these once, with your first enquiry:

| | |
|---|---|
| **Markets** | Countries and languages you can field |
| **Specialisms** | Any sector or audience you're genuinely strong in — B2B, healthcare professionals, IT decision-makers, automotive, finance, parents, low-incidence medical. This is often the reason we'd route a study to you rather than to an exchange, so don't undersell it |
| **CPI** | Your cost per complete, by market. By LOI and incidence band if your pricing varies that way |
| **Capacity** | Realistic completes per day, per market |
| **Panel provenance** | Where your respondents come from — proprietary panel, router, affiliate traffic, client list. We don't object to any of these, but we price and screen differently, and finding out later is a problem |
| **Respondent ids** | Format, and whether an id is stable for the life of the panelist or just the session |
| **Deduplication** | Whether you dedupe within a study, and across studies |
| **Contact** | A named person for live fieldwork issues, with hours |
| **DPA** | Your data processing agreement |

Pricing on this path is agreed per project rather than quoted through an API, so the CPI you give us is the figure we hold for that study. Tell us when it changes.

### Five return URLs

| Outcome | What it means | Required |
|---|---|---|
| `complete` | Finished and qualified | **Yes** |
| `disqualify` | Failed a screener question | **Yes** |
| `terminate` | Ended by survey logic after screening | **Yes** |
| `over_quota` | Qualified, but their quota cell was full | **Yes** |
| `bad_quality` | Blocked by fraud or duplicate detection before starting | Strongly recommended |

If your protocol doesn't separate `disqualify` from `terminate`, give us the same URL twice — we'd rather you were explicit than have us guess.

`bad_quality` is the one partners most often skip, and it's the one that costs you money. It's where we return a respondent that Research Defender blocked at the door — a bot, a VPN, a repeat device. Without it they fall back to your terminate leg, which means you can't tell "we rejected this person as fraudulent" from "they failed a screener", and you can't replace them. Supply it.

Send the five to your Flashpoint contact, or the buyer can add them directly in the app. Once saved, your source is reusable across every study the team runs with you.

## The entry link

You'll receive a link shaped like this:

```
https://flashpointopinions.com/a1b2c3d4-5678-90ab-cdef-1234567890ab?rid=<RESPONDENT_ID>&fp_src=f0e1d2c3-b4a5-6789-0123-456789abcdef
```

| Part | What it is | Who sets it |
|---|---|---|
| `/a1b2c3d4-…` | The survey | We do |
| `rid` | **Your** respondent identifier | **You substitute, per respondent** |
| `fp_src` | Identifies you as the source | We do — send it back unchanged |

Two rules:

**Always substitute a real `rid`.** It is how a respondent is attributed to you, how we return them to the right place, and how reconciliation works later. A link shipped with `rid=` left empty loses every respondent's identity.

**Never strip `fp_src`.** It tells us which partner the respondent came from, which decides which return leg they get. A respondent arriving without it on a study with more than one source cannot be reliably attributed, and we will not guess — a guess sends someone to the wrong vendor's passback.

You may append any other query parameters you like. We capture all of them and store them against the response, so anything you need back at reconciliation time — your session id, supplier id, campaign — survives the round trip.

## Returning a respondent

When the respondent finishes, we redirect the browser to the URL you gave us for that outcome.

Your URLs can carry placeholders, which we substitute at redirect time:

| Token | Substituted with |
|---|---|
| `{{rid}}` | The respondent id you sent on entry |
| `{{response_id}}` | Our internal response id, useful for support tickets |
| `{{QUESTION_LABEL}}` | That respondent's answer to any question, by its label |

Values are URL-encoded on substitution. An unknown token, or one with no value for this respondent, becomes an empty string rather than breaking the URL.

**Example.** You provide:

```
complete     https://panel.example.com/return?pid={{rid}}&status=complete
disqualify   https://panel.example.com/return?pid={{rid}}&status=screenout
terminate    https://panel.example.com/return?pid={{rid}}&status=screenout
over_quota   https://panel.example.com/return?pid={{rid}}&status=quotafull
bad_quality  https://panel.example.com/return?pid={{rid}}&status=security
```

A respondent who entered with `rid=XYZ789` and completed is redirected to:

```
https://panel.example.com/return?pid=XYZ789&status=complete
```

Piping an answer back works the same way — if your side wants the respondent's self-reported age for your own profiling, and the survey has a question labelled `AGE`:

```
https://panel.example.com/return?pid={{rid}}&age={{AGE}}
```

URLs must be absolute and begin with `http://` or `https://`. Relative paths are rejected when the source is saved.

## Our quality bar

Worth reading before you field rather than after, because it's the thing most likely to end a partnership.

**Every respondent is screened twice.** Research Defender runs before they reach a question — fraud, duplicates, VPNs, repeat devices. ReDem scores open-ended answers after the fact. Respondents who fail either are excluded from the deliverable.

**Excluded respondents aren't billed.** You won't pay for traffic we reject, and we won't pay for it either. We'll send you the respondent ids so you can look at them on your side.

**We watch source-level patterns, not just individuals.** The signals that get a source paused for review:

- Open-ended answers that are templated or near-identical across respondents
- A language profile that doesn't match the market — a notably high share of English answers in a non-English market is the usual tell
- Quality scores clustered at a single value rather than distributed
- Completion times tightly grouped in a way organic traffic isn't

Any one of these can be innocent. Together they mean we stop the source, review, and come to you with the evidence before resuming. It's recoverable, and it goes much better when the expectation was set in advance.

**Replacement.** Excluded completes don't count toward quota, so a study will keep running to make up the shortfall. If exclusions run high enough that you can't fill, we'd rather talk about it early than let the study stall.

## Test before you field

Ask your Flashpoint contact for a test link against a draft study. Preview responses are flagged and excluded from quotas, completes and analytics, so you can walk the flow as many times as you need without touching live data.

Walk all five legs and confirm each one arrives on your side with the outcome you expect:

- Complete the survey → lands on your `complete` URL
- Fail a screener → `disqualify`
- Trigger a mid-survey terminate → `terminate`
- Enter against a filled quota cell → `over_quota`
- If you can simulate a blocked entrant → `bad_quality`

Check the `rid` that comes back is byte-for-byte the one you sent.

## Go-live checklist

- [ ] All five return URLs supplied and saved
- [ ] All five legs walked on a test link, each landing where expected
- [ ] `rid` round-trips unchanged
- [ ] `fp_src` present on every link you'll field, and passed through untouched
- [ ] Your side distinguishes over-quota from screen-out
- [ ] Commercial terms and DPA in place
- [ ] A named contact on each side for live fieldwork issues

## If something looks wrong

**Respondents arrive but aren't attributed to us.** Almost always a missing or altered `fp_src`. Check the link you're actually fielding, not the one you were sent — rewriting through a router is the usual culprit.

**Respondents reach the end and don't come back to you.** The study has no return leg for that outcome, or the source wasn't attached before fielding started. Tell us the `response_id` if you have it.

**Everyone comes back as a terminate.** You likely didn't supply `over_quota` or `bad_quality`, so both fall back to the terminate leg.

**Your completes don't match ours.** Ours count only respondents who finished and qualified; a fingerprint count of everyone who touched the link will always be higher. Ask us for the field report, which breaks it down by outcome.

## Reference

**Entry parameters**

| Parameter | Required | Notes |
|---|---|---|
| `rid` | Yes | Your respondent id. `panel_id` and `PID` are also accepted and normalised. |
| `fp_src` | Yes | Your source id. Pass through unchanged. |
| *anything else* | No | Captured and stored against the response. |

**Return legs:** `complete`, `disqualify`, `terminate`, `over_quota`, `bad_quality`

**Template tokens:** `{{rid}}`, `{{response_id}}`, `{{ANY_QUESTION_LABEL}}`

## Next steps

- [Integrate your API](/partners-api-integration) — if we're going to field together continuously
- [Data quality](/data-quality) — what we screen for before your respondent starts


---

# Integrate your API

For partners we expect to field with continuously. We build an adapter against your API, and your panel appears directly in the buyer's targeting interface — they select your audience, see feasibility and price, approve, and watch it field, without leaving Flashpoint.AI.

This page sets out how the project runs and exactly what we need from you. Most of it is questions rather than requirements. Sample APIs differ enormously in shape — study-based, project-and-line-item, quota-group — and we don't need yours to look like anything in particular. We need to know its shape precisely before we write against it.

## What you get

- **Demand from the buyer's own workflow.** Buyers reach your panel while designing the study, not by filing a request with an account team.
- **Clean traffic.** Every entrant is screened for fraud and duplication before they start, and returned to you on a dedicated leg if blocked.
- **Correct outcome reporting.** Five distinct return codes, including over-quota as its own event.
- **Reconciliation through your API** where you support it, rather than as a spreadsheet emailed to your account team.
- **Real inputs to your pricing.** We pass our incidence and length-of-interview estimates at quote time, so a floor price computed from IR, LOI and country is computed from honest numbers.

## How the project runs

| Stage | What happens | Typical duration |
|---|---|---|
| **0. Spec exchange** | You send API docs (and an OpenAPI spec if you have one). We return a written gap analysis against this page. | 2 working days |
| **1. Staging access** | You issue staging credentials. We run a read-only probe to confirm the answers empirically. | 2–3 days |
| **2. Build** | We write and test the adapter. We'll come back with questions; a named engineering contact on your side keeps this short. | 1–2 weeks |
| **3. Certification** | Joint walk-through of the test script below, on staging. | 2–3 days |
| **4. Soft launch** | A small live buy at reduced quotas, watched closely by both sides. | 1 week |
| **5. Generally available** | Your panel appears in the picker for all teams. | — |

The slowest stage is almost always 0 — not because the questions are hard, but because they're usually spread across several people. Nominating one technical owner on your side typically halves the timeline.

## 1. Operations

| Operation | What we use it for | Required |
|---|---|---|
| Create project / study | Set up the buy in draft, without spending | **Yes** |
| Launch | Go live | **Yes** |
| Pause / resume | Stop and restart spend mid-field | **Yes** |
| Status | Live counts: completes, starts, in-progress, screen-outs, over-quota | **Yes** |
| Close / complete | End fieldwork cleanly | **Yes** |
| Feasibility | "Can you deliver 800 of this audience?" | **Yes** — mechanism flexible |
| Pricing | A cost we can charge against | **Yes** — mechanism flexible |

Feasibility and pricing are **capabilities we require**, but the mechanism is yours to choose. Neither has to be an API endpoint. What we can't do is sell sample we can't size and can't cost — a buyer who pays for a study that never fills is a refund and a lost client, and we won't put a partner in that position either.

### Feasibility — required, mechanism flexible

Before we take a buyer's money we have to answer "will this fill?". We accept any of three mechanisms:

1. **A feasibility endpoint.** Preferred.
2. **A documented soft-launch protocol.** Launch at reduced quotas, read the result, then scale or stop. It costs money but it gives a true answer, and it's what several exchanges recommend themselves. If this is your model, we need the protocol written down — what percentage, how long to wait, what signal means "go".
3. **A committed human response time.** Your team answers a feasibility request within a stated number of working hours, on a channel we can build a process around.

What we can't work with is none of the three.

If you do have an endpoint:

- **Does it need an object created first?** Some APIs have no pre-project feasibility — it exists only *on* a draft project, so asking the question creates something. If that's your model, say so; it changes how we clean up abandoned quotes.
- **Synchronous or polled?** If polled, tell us the states and a sensible backoff.
- **Chargeable or rate-limited?** We'd like to probe several locales to learn which are live. If that's abusive on your side, tell us the budget.
- **Is the number a pool size or a deliverable estimate?** These are routinely conflated and they are not the same thing. "How many panelists match these filters" and "how many completes we can deliver" are different numbers, and payloads rarely distinguish them. Quoting the first to a buyer as though it were the second over-promises badly, so please say which you return.
- **Does it account for price, LOI and quotas, or targeting alone?** Raising the CPI usually changes the answer, so a feasibility that ignores price tells us much less.

Of our normalised result, which can you populate?

| Field | Meaning |
|---|---|
| `feasible` | Can this be delivered at all |
| `estimated_completes` | How many — pool or deliverable, per above |
| `estimated_ir` | Expected incidence |
| `estimated_loi` | Expected length of interview |
| `estimated_days` | Time to fill |
| `country_availability` | Which requested markets are live |

And one that matters more than it first appears: **how do you signal "I can't answer" as distinct from "the answer is zero"?** A market your engine doesn't model and a market with no panelists are different facts. Collapsing them means we tell a client a country is dead when it isn't. An explicit refusal for locales you can't predict in is the right behaviour. If you return `0` for both, we need to know, so we never report it as unavailability.

### Pricing — required, and here's exactly why

We cannot show a buyer a quote, or take a payment, without a cost for the buy. This isn't a preference — a provider with no cost signal cannot be sold through the product at all.

Three sources work, in order of preference:

1. **A cost returned with feasibility, or a dedicated pricing endpoint.** Common on exchanges, and the simplest for everyone — feasibility and pricing become a single integration rather than two.
2. **A cost calculator.** We name an offer price, you return the all-in total including your fees. Suits models where the buyer sets the incentive.
3. **A rate card you give us, which we hold.** Entirely workable, but it must arrive before launch, not after. We need:
   - CPI by **country × LOI band × IR band**
   - The premium for niche or low-incidence targeting, as a multiplier or an absolute
   - Currency, and whether the figure is all-in or exclusive of your fee
   - Validity period, and who notifies whom when it changes

**A floor price you enforce internally but don't expose is not a pricing mechanism** — we can't read it, so we can't quote from it. If that's your situation today, option 3 is the fix.

### Floor prices

If you derive a **floor price** from incidence rate, length of interview and country — as most exchanges do — one answer matters above all others:

> **Is the floor enforced, or advisory?**

If it's enforced, a buy priced below it fails at creation, we see the error, and we correct before anyone is charged. If it's advisory, an under-priced survey goes live and quietly under-fills: we can't detect that from the API, the buyer has already paid, and the first signal is a study sitting at 30% a week later. It materially changes how we build the pricing path.

### Changes once it's live

Which of these can change mid-field, and do they apply to traffic already in flight?

- Sample size / completes wanted
- Price per complete
- Quota cell targets
- Targeting criteria
- Field end date

Price especially. If the remedy for slow fill is "raise the CPI", we need to do that through the API rather than by email.

## 2. Authentication and request semantics

We need **service credentials**, not a human login. An integration authenticating as a named person's email and password breaks when that person leaves, rotates, or enables MFA.

- Credential type (OAuth2 client credentials, API key, signed request) and the token endpoint
- Exact `Authorization` header format, including whether a `Bearer` prefix is expected — some APIs take the raw token and reject the prefix
- Token lifetime, and whether there's a refresh endpoint or we re-authenticate
- **Any rate limit on token minting.** Worth flagging early: we run multiple API replicas and a deploy restarts them together. If minting is capped per credential per hour, we need a shared token cache to avoid locking ourselves out. Knowing in advance makes it a design decision instead of an incident.
- Separate credentials for staging and production
- Rate limits per endpoint family, and the response shape on 429

**Idempotency.** Creating a project and launching it are the two calls where a network timeout is genuinely dangerous — we don't know whether it landed, and a blind retry can create a second live buy spending real money. Do you accept an `Idempotency-Key` header, or another safe-retry mechanism, on creates and launches? If not, we'll build a read-back-before-retry path instead.

**Error semantics.** Which responses are retryable and which are terminal? A `400` that actually means "try again in a moment" — for instance a draft that reads back empty for a second after a successful write — is worth documenting rather than leaving us to discover.

## 3. How your objects map to a study

Our unit is a survey, which may run in several countries and languages at once.

- What is the unit that actually fields — a study, a line item, a target group, a stream?
- **Is it scoped to one country and one language?** If so, a single multi-market study of ours becomes several objects on yours. We need to know how they're grouped, and whether quotas and exclusions span them.
- Is there a container above it we also have to create?
- Which identifiers must we store to operate the buy afterwards? Some APIs need both a parent and a child id on every subsequent call.

## 4. Entry links

We generate the survey URL. You append or substitute your respondent identifier.

- The **exact placeholder token** for the respondent id (for example `[%RID%]`, `{psid}`, `%rdud%`), and whether it's case-sensitive
- If you've retired an older token, please say so explicitly, and tell us which pages of your documentation are out of date
- Can you **pipe qualification answers** into the entry link? If a respondent has already told you their age and gender, we'd rather not ask again: it costs LOI and it annoys panelists. What's the syntax, and which qualifications are available?
- Any URL length limit, and is HTTPS required?
- What happens if the same respondent id re-enters — resume, or duplicate?
- Do you support device targeting (desktop / tablet / mobile), and is it enforced on your side or expected to be ours?

## 5. Targeting and filters

This is where most of the integration effort goes.

### The demographics we always map

These are the canonical keys buyers use. We need your equivalent for each — attribute or question id, **and** the option codes.

| Canonical key | Notes |
|---|---|
| `age` / `age_min` / `age_max` | Usually a range rather than banded options |
| `gender` | Tell us if your question has only two options, so we warn rather than mistarget |
| `household_income` | Banded, and bands differ per market |
| `education` | |
| `employment_status` | |
| `employment_sector` | Industry, where available |
| `ethnicity` / `race` | |
| `hispanic` / origin | Often a multi-option origin question rather than yes/no |
| `marital_status` | |
| `household_composition` | Household size |
| `parental_status` / `has_children` | |
| `student_status` | |
| `language` | First or spoken language |
| `nationality` | Where distinct from country of residence |
| `country` | ISO 3166-1 alpha-2 preferred |
| `us_state`, `us_region`, `zip` | And equivalents for other markets |

Anything beyond this list we resolve at request time from your catalogue rather than hard-coding, so the catalogue endpoint matters as much as the standard list.

### How conditions are expressed

- **Condition types**: selection from a list, numeric range, open-ended value list (ZIP or postcodes), derived? We need to know which type each attribute is — they serialise differently.
- **Boolean semantics**, precisely: within one attribute, are multiple options OR-ed? Between attributes, AND-ed? Is there negation?
- Is there a **limit** on conditions per survey, or a point past which feasibility collapses?
- Are some attributes usable only for **screening** and others only for **quotas**? If you expose separate flags, tell us which is which — reading the wrong one silently drops valid targeting.
- Can we send a **raw, vendor-native targeting payload** as an escape hatch when a buyer needs something our canonical mapping doesn't cover?

### Catalogue stability

- Endpoint for the full attribute / qualification catalogue, with option codes
- **Are ids stable across locales**, or does each market renumber? If question ids are global but option codes are per-market, say so — it decides whether we can cache a static map or must resolve per market.
- How often does the catalogue change? Is there a changelog or version?
- Countries and languages, and critically **which combinations you can actually field** rather than sell into. A locale in a catalogue is not the same as a locale with panelists behind it, and a market quoted in the wrong language can succeed quietly while fielding the wrong people.

## 6. Quotas

- **Can you enforce quotas at all**, or do you send undifferentiated traffic and expect us to terminate over-quota respondents?
- Are cell targets **counts or percentages**?
- Do you support **interlocked** cells (age *and* gender in one cell), or only independent dimensions?
- Can quota targets change mid-field?
- When a cell fills, do you stop sending matching respondents, or do they keep arriving for us to bounce?
- Is there a cap on the number of cells?

Anything you can't field, we enforce ourselves — targets hold either way. The difference is efficiency: a split you can't field means respondents reach the survey and get screened out, which wastes your sample and bounces panelists for nothing.

## 7. Return legs

When a respondent finishes we redirect them back to you. **We need to signal five outcomes distinctly:**

| Outcome | Meaning |
|---|---|
| Complete | Finished and qualified |
| Screen-out | Failed a screener question |
| **Over-quota** | Qualified, but their quota cell was already full |
| Quality terminate | Failed a data-quality check |
| Security terminate | Failed a fraud check |

**Over-quota must not collapse into screen-out.** They are commercially different events. A respondent who qualified and hit a full cell is not a screener failure, and merging them corrupts the incidence rate on both sides of the trade — which then misprices the next wave and misreports to your suppliers. If your protocol genuinely has no over-quota code, tell us and we'll record the limitation rather than silently mislabel.

**Quality and security must be separable from an ordinary terminate.** A quality flag affects a panelist's reputation score and can trigger supplier disputes. We don't emit one without a real signal, and we'd ask that you don't treat our ordinary terminates as quality events either.

For each outcome:

- The exact URL, or the single URL plus the distinguishing code
- Parameter names, and whether order matters
- **The signing scheme, if any** — algorithm, precisely which string is signed (full URL? path and query? which parameters, in what order?), whether a secret is included in the signed string but excluded from the sent URL, the parameter carrying the hash, and where we obtain the secret
- Whether signing is account-level opt-in. If it can be enabled later, we want to know now — the failure mode is every respondent bouncing at once.

A worked example with a real signature we can reproduce is worth more than a page of prose.

## 8. Status delivery

In order of preference: server-to-server, then webhooks, then polling.

### Server-to-server

What we'd rather use. The respondent's browser is an unreliable carrier — redirects get lost, blocked and spoofed, and a lost one is a ghost complete. If you accept a server-side status post we'll use it and treat the redirect as confirmation.

- Endpoint and auth. **Is it the same credential as the main API, or a separate key?**
- **The status code values — and whether they share a namespace with your redirect codes.** Overlapping numeric namespaces are common: the same integer meaning one thing on a redirect and another on a status post. If yours differ, please flag it clearly; if they're identical, say that too.
- **Ordering.** Do we post before or after redirecting the browser? And does a successful post change *which* URL we should redirect to — some protocols send an acknowledged respondent to a different confirmation URL.
- What does a `200` mean — accepted, or committed?
- Idempotency and replay: what happens if we post the same respondent twice, or post after a redirect already landed?
- **Your p99 latency.** This sits on the respondent's submit path, so we hold it to a hard timeout and fall back rather than make a panelist wait.
- Is there a **validation endpoint** — "is this respondent genuinely in-survey right now?" We use that to catch replayed or fabricated respondent ids before accepting a complete, and it's one of the more valuable things an API can offer.

### Webhooks

Which events, what retry policy, how the payload is signed, and whether we can register the endpoint through the API or your team configures it.

### Polling

Rate limit, pagination model, and how quickly data is consistent after a respondent finishes.

## 9. Test traffic

We QA every survey before it fields, and we won't do that against live panelists.

- Is there a **test or preview link** that walks entry and return without spending or touching real supply?
- Can we exercise all five return legs on staging and see the outcome recorded on your side?
- Does staging have a usable qualification catalogue, or is it empty?
- Can a staging survey be launched, paused and closed like a real one?

## 10. Exclusions and recontact

- Can we **exclude respondents** who took a previous wave, by respondent id?
- Can we **recontact** a specific list of respondent ids for a follow-up?
- How long are respondent ids stable — across a project, or for the life of the panelist?
- Is there deduplication across sources within one survey?

## 11. Reconciliation and billing

We run fraud and data-quality screening and exclude respondents **after** fieldwork, so:

- Can we **push rejections back** via API? Without it we pay for respondents we've already discarded, and cleanup becomes a spreadsheet emailed to your account team.
- What's the reconciliation deadline, and is there a rejection-rate cap before it needs a conversation?
- Do you report **per-respondent cost**? That makes "did we under-price this?" answerable with data rather than at invoice time.
- Do you report your *own* terminates — respondents rejected before they reached our survey — granularly enough to tell fraud from a closed quota?
- **When does a complete become billable, and when is it final?** On redirect, on acknowledgement, or at reconciliation close? This decides when we can settle with the buyer.
- Do you measure and report **actual IR and LOI**? That's the input to pricing the next wave.

## 12. Commercial, legal and operational

- **Coverage and specialisms.** Markets, approximate reach per market, and any sector or audience you're genuinely strong in — B2B, healthcare professionals, IT decision-makers, automotive, finance, low-incidence medical. Buyers ask us for these by name, and a panel that can reach one reliably gets routed work an exchange can't service.
- Staging and production base URLs, and whether staging can create, launch and return test traffic
- Support contact and escalation path for live fieldwork, with hours
- Invoiced or per-transaction billing, and settlement currencies
- Whether an existing agreement with us covers API access or it needs a separate contract
- **Data protection**: your DPA, the controller/processor split, data residency, and the basis on which panelists consent to third-party research
- Any survey content review or category restrictions before fielding

## The checklist

Answer in whatever format suits you — a document, a spreadsheet, or inline in an email. We'll take any of them.

| # | Question |
|---|---|
| **Auth** | |
| 1 | Service credentials available (not a personal login)? Auth type and token endpoint? |
| 2 | Token lifetime, and any rate limit on minting tokens? |
| 3 | Exact `Authorization` header format — `Bearer` prefix or raw? |
| 4 | Idempotency key accepted on create and launch? |
| **Commercial** | |
| 5 | Feasibility mechanism: endpoint, documented soft launch, or SLA'd human answer? |
| 5a | If an endpoint: does it require creating a draft object first? |
| 6 | Feasibility synchronous or polled? Rate-limited or chargeable? |
| 7 | Does feasibility return a **pool size** or a **deliverable estimate**? |
| 8 | Which of `feasible`, completes, IR, LOI, days, availability can you populate? |
| 9 | How do you distinguish "can't answer" from "zero available"? |
| 10 | Pricing mechanism: cost with feasibility, a cost calculator, or a rate card you give us? |
| 10a | If a rate card: CPI by country × LOI × IR, niche premium, currency, validity |
| 11 | If there's a floor price: **enforced or advisory?** |
| 12 | Can price, sample size and quotas change mid-field, and does it apply to live traffic? |
| **Structure** | |
| 13 | What object fields — is it scoped to one country and one language? |
| 14 | Which ids must we store to operate the buy afterwards? |
| **Entry** | |
| 15 | Exact respondent-id placeholder for the entry link |
| 16 | Can qualifications be piped into the entry link? Syntax? |
| 17 | Device targeting supported, and enforced by whom? |
| **Targeting** | |
| 18 | Attribute/question ids and option codes for the standard demographics list |
| 19 | Condition types supported (selection, range, open-ended list) |
| 20 | Boolean semantics: OR within an attribute, AND between, negation? |
| 21 | Are ids stable across locales, or does each market renumber? |
| 22 | Screening-only vs quota-eligible attributes — separate flags? |
| 23 | Country × language combinations you can genuinely field |
| **Quotas** | |
| 24 | Can you enforce quotas, or is it all our side? |
| 25 | Counts or percentages? Interlocked cells supported? |
| 26 | When a cell fills, do you stop sending matching respondents? |
| **Returns** | |
| 27 | Return URL or code for each of: complete, screen-out, over-quota, quality, security |
| 28 | Redirect signing: algorithm, exact signed string, secret source, hash parameter |
| 29 | Is signing account-level opt-in? |
| **Status** | |
| 30 | S2S, webhook, or polling? Endpoint and auth |
| 31 | If S2S: do status codes share a namespace with the redirect codes? |
| 32 | If S2S: post before or after redirect, and does it change the redirect URL? |
| 33 | If S2S: idempotency, p99 latency, and is there a respondent validation endpoint? |
| 34 | If polling: rate limit and pagination |
| **Data** | |
| 35 | Can we push reconciliation rejections back? Deadline and caps? |
| 36 | Is per-respondent cost reported? |
| 37 | When does a complete become billable and final? |
| 38 | Are actual IR and LOI reported back? |
| **Operations** | |
| 39 | Test/preview link exercising entry and all five return legs without spending |
| 40 | Staging environment that can create and launch |
| 41 | Respondent exclusion and recontact by id — supported? |
| 42 | Support and escalation contact for live fieldwork |
| 42a | Sector or audience specialisms, and approximate reach per market |
| 43 | DPA, data residency, controller/processor split |
| 44 | Any survey content review or category restrictions |

## Certification

Before going live we walk this jointly, on staging, with real test traffic:

1. All five return legs, each confirmed as the correct outcome on your side
2. A complete that attributes and bills correctly
3. An over-quota recorded as over-quota, not as a screen-out
4. Pause genuinely stopping spend, and resume restarting it
5. Quota cells filling and closing as expected
6. A reconciliation rejection round-tripping, if supported
7. Status counts on your side matching ours

We share the script in advance and run it together.

## Get started

Email **[developers@flashpoint.ai](mailto:developers@flashpoint.ai)** with your API documentation — and an OpenAPI specification if you have one, which shortens the first pass considerably. We'll come back within two working days with a written gap analysis against this page.

If you'd rather prove the commercial fit before committing engineering time on either side, [send us traffic](/partners-send-traffic) first. It's live the same day and nothing about it blocks this route later.

## Next steps

- [Overview](/partners) — the two integration paths compared
- [Send us traffic](/partners-send-traffic) — the no-build path
- [Data quality](/data-quality) — the screening every respondent passes before they reach a question


---

# Distribute

Six channels reach respondents. All of them funnel into the same response store, segmented by `panel_id` so you can break down results per source without any extra configuration.

## Channels at a glance

| Channel | When to use | Typical latency | Detail page |
|---|---|---|---|
| **Public link** | Open recruitment — share one URL anywhere | Instant | (below) |
| **Email list** | You own the recipient list — tracked, tokenized invites via SendGrid | Seconds to deliver | [Email distribution](/distribute-email) |
| **First-party panel** | A reusable list of your own people with attributes, filters, and consent tracking, sendable to any survey | Seconds to deliver | [Your own panels](/distribute-email#your-own-panels-first-party-panels) |
| **Synthetic panel** | Directional data with no humans — AI-generated respondents | Minutes per cohort | [Synthetic](/sample-synthetic) |
| **Prolific** | Real respondents from Prolific's vetted academic panel | Hours to days | [Prolific](/sample-prolific) |
| **Dynata** | Large general-population panel for high-scale studies | Hours to days | [Dynata](/sample-dynata) |

## Public link

The simplest channel. Publish the survey and share its public URL:

```text
https://flashpoint.ai/s/{survey_id}
```

Anyone with the link can respond. The link is live as soon as the survey status is `active` and stops accepting submissions when the survey is `paused` or `completed`.

Public-link responses arrive with `panel_id = null`, labeled as **Open distribution** in the Analyze tab. This is the right choice for embedded survey links on your website, QR codes at events, or social-media posts where you do not need to track individual recipients.

```bash
# Verify a survey is active (and therefore accepting public responses)
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id} \
  -H "Authorization: Bearer $TOKEN"
```

The response includes `"status": "active"` when the link is live.

## Email list

Upload or paste a list of email addresses, customize the invitation template, send. Every recipient gets a unique tokenized link so each response ties back to a specific email address.

The pipeline validates addresses via ZeroBounce, delivers through SendGrid at 10 emails/sec, and tracks per-recipient status from `pending` through `sent`, `clicked`, and `completed` (or `bounced`).

Key operations:

- **Create a list** — from inline emails or a saved custom panel.
- **Compose a template** — AI-drafted subject, body, and CTA.
- **Send** — survey must be active; irreversible once triggered.
- **Track** — per-recipient delivery and completion status.
- **Resend** — remind non-respondents without re-mailing those who already completed.
- **Add recipients** — append to an existing list after the initial send.

Full walkthrough with curl examples: **[Email distribution](/distribute-email)**.

## Synthetic panel

AI-generated personas take the survey end to end. Responses arrive in minutes rather than days, tagged with a synthetic `panel_id` so you can include, exclude, or compare them against real respondents in any analysis.

Useful for directional pre-fielding, concept testing, and pressure-testing questionnaire flow before spending on human recruitment.

Full details: **[Synthetic panels](/sample-synthetic)**.

## Prolific

Real respondents recruited from Prolific's panel. The flow: quote, approve, pay (Stripe), launch, field, close. Prolific demographic data (age, gender, country) is attached to each response. Responses carry `panel_provider = "prolific"` and the Prolific-specific `panel_id`.

Full details: **[Prolific](/sample-prolific)**.

## Dynata

A larger general-population panel for higher-scale studies. Same quote-approve-pay-launch-field lifecycle as Prolific, with Dynata's own demographic filters and provider-specific respondent metadata.

Full details: **[Dynata](/sample-dynata)**.

## How panel_id segments responses

Every channel produces a panel with a unique `panel_id`. Responses persist with that identifier so the Analyze tab can answer "what did Prolific say vs. my email list?" in one filter change.

| Source | panel_id value |
|---|---|
| Public link | `null` (shown as "Open distribution") |
| Email list | UUID of the email list |
| Synthetic panel | UUID of the synthetic panel |
| Prolific | UUID of the Prolific panel |
| Dynata | UUID of the Dynata panel |

Pass `panel_id` as a query parameter on any analytics endpoint to scope results:

```bash
curl "https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics?panel_id={panel_id}" \
  -H "Authorization: Bearer $TOKEN"
```

Use `panel_id=open` to see only public-link traffic.

## Quotas during fielding

When a survey defines quotas, every incoming response is checked against quota state before it persists. Three outcomes:

- **Quota open** — response is recorded normally.
- **Quota full** — respondent is routed to a "thank you" page; response is recorded as `screen_out`.

Quota state is live across all channels. A synthetic respondent filling a demographic cell counts against the same quota a Prolific respondent would fill.

## Next steps

- Set up email campaigns: **[Email distribution](/distribute-email)**.
- Analyze what came back: **[Analyze](/surveys-analyze)**.
- AI-powered insights: **[AI insights](/analyze-ai)**.
- Check data quality: **[Data quality](/data-quality)**.


---

# Email distribution

Send tracked survey invitations to your own contact list. Each recipient gets a unique tokenized link, and you can monitor delivery, clicks, and completions per person.

## Creating an email list

An email list ties a set of recipients to a survey. Create one by providing emails inline or by referencing a saved custom panel.

### From inline emails

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q4 Customer Feedback",
    "emails": [
      {"email": "anna@example.com", "name": "Anna Chen"},
      {"email": "bob@example.com", "name": "Bob Patel"},
      {"email": "carol@example.com", "segment": "enterprise"}
    ]
  }'
```

Response:

```json
{
  "id": "el_a1b2c3d4-...",
  "survey_id": "srv_...",
  "name": "Q4 Customer Feedback",
  "total_count": 3,
  "sent_count": 0,
  "validation_status": "pending",
  "sending_status": "draft",
  "source_panel_id": null,
  "email_template": null,
  "created_at": "2026-05-26T14:00:00Z"
}
```

Each recipient object requires an `email` field. Additional metadata fields (`name`, `segment`, or any custom key) are stored and can be used for personalization or downstream analysis.

Duplicate emails within a list are silently skipped.

### From a custom panel

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "panel_id": "pnl_f5e6d7c8-..."
  }'
```

The list inherits all contacts from the panel. Changes to the panel after creation do not affect the list.

### Via the agent

> "Create an email list for my NPS survey with anna@example.com and bob@example.com"

The agent calls `create_email_list` with the emails you provide. It will never invent or guess email addresses.

## Custom panels

A custom panel is the simpler, API-first form of a reusable contact list: a flat set of addresses saved at the team level that can seed an email list on any survey. If you want per-person attributes, filters, consent tracking across sends and a console UI, use a [first-party panel](#your-own-panels-first-party-panels) instead.

### Create a panel

```bash
curl -X POST https://api.flashpoint.ai/api/v1/panels/custom \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beta Testers",
    "description": "Early access program members",
    "emails": [
      {"email": "tester1@example.com", "name": "Alice"},
      {"email": "tester2@example.com", "name": "Bob"}
    ],
    "tags": ["beta", "product"]
  }'
```

Response:

```json
{
  "id": "pnl_f5e6d7c8-...",
  "name": "Beta Testers",
  "description": "Early access program members",
  "total_count": 2,
  "tags": ["beta", "product"],
  "created_at": "2026-05-26T14:00:00Z"
}
```

### List panels

```bash
curl https://api.flashpoint.ai/api/v1/panels/custom?limit=50&offset=0 \
  -H "Authorization: Bearer $TOKEN"
```

### Via the agent

> "Create a custom panel called 'Q4 Enterprise Clients' with these emails: ..."

The agent calls `create_custom_panel` and returns the panel ID for future use.

## Your own panels (first-party panels)

For a list you will reuse — customers, members, a student cohort, event attendees — build a first-party panel. It lives at the team level in **Console → My Panels**, keeps per-person attributes you can filter on, tracks consent (unsubscribes and bounces are remembered per person, not per list), and can be attached to as many surveys as you like.

| Step | Where |
|---|---|
| Upload a spreadsheet (CSV / XLSX) and map the columns | Console → My Panels → New panel |
| Add people by typing their addresses in chat | Agent / MCP: "create a panel called Alumni 2026 with anna@…, bob@…" |
| Add more people later | Console, or "add these people to my Alumni panel" |
| See who would actually be mailed | "how many people on Alumni would get this survey?" (`preview_panel_audience`) |
| Send the survey | "send my NPS survey to the Alumni panel" (`send_survey_to_panel`) |
| Remind people who have not finished | "remind the Alumni panel" — the saved filter reaches the same people |
| Reach only people added since the last send | filter `__never_sent` |
| Check how it is landing | "how is the Alumni send doing?" (`get_panel_send_report`) |

Rules the agent enforces for you:

- It only ever adds addresses you typed. It will not invent, guess or use example addresses, and it will not read a spreadsheet from chat — upload those in the console.
- Sending is irreversible, so it previews the audience and tells you the count before it sends, then asks you to confirm.
- Anyone who has unsubscribed or bounced is excluded automatically and reported in the result.
- The survey must be published first.

Each panel send creates a tracked email list under the survey, so everything below (template, tracking, resend, per-recipient status) applies to panel sends too.

## Email template

Every send uses a template with three fields:

| Field | Description | Default |
|---|---|---|
| `subject` | Email subject line (max 65 chars recommended) | `You're invited: {{SURVEY_NAME}}` |
| `body` | Plain-text body; must contain `{{SURVEY_LINK}}` | Generic invitation text |
| `cta_text` | Call-to-action button label (2-4 words) | `Take the Survey` |

### Supported placeholders

| Placeholder | Substituted with |
|---|---|
| `{{SURVEY_LINK}}` | Personalized survey URL with recipient token (required) |
| `{{SURVEY_NAME}}` | Survey title |
| `{{RECIPIENT_EMAIL}}` | Recipient's email address |
| `{{SENDER_NAME}}` | From name (default: "Flashpoint Surveys") |

### AI-drafted templates

The agent can draft or rewrite invitation copy using the `compose_email_template` tool. It reads the survey's name, audience, objective, and estimated length to generate contextual copy.

> "Draft a casual, friendly invitation email for this survey"

> "Make the email shorter and mention the $10 incentive"

The tool returns a `{subject, body, cta_text}` object that you can pass directly to the send call. It does not save or send anything on its own.

### Attaching a template at list creation

You can save a template on the email list at creation time:

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Launch Invite",
    "emails": [{"email": "user@example.com"}],
    "email_template": {
      "subject": "Quick 3-minute survey about your experience",
      "body": "Hi there,\n\nWe value your feedback. This takes about 3 minutes.\n\n{{SURVEY_LINK}}\n\nThanks!",
      "cta_text": "Share your feedback"
    }
  }'
```

The saved template is used as the default for sends and resends unless overridden.

## Sending

Trigger delivery of an email list. The survey must be `active` (published) before sending. This action is irreversible.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base_survey_url": "https://flashpointopinions.com/{survey_id}"
  }'
```

Response:

```json
{
  "id": "el_a1b2c3d4-...",
  "survey_id": "srv_...",
  "name": "Q4 Customer Feedback",
  "total_count": 3,
  "sent_count": 3,
  "validation_status": "validated",
  "sending_status": "sent",
  "source_panel_id": null,
  "email_template": null,
  "created_at": "2026-05-26T14:00:00Z"
}
```

### What happens during a send

1. **ZeroBounce validation** — every recipient is validated before anything is sent, on every path (API, console, panel sends, agent). Invalid, disposable, spam-trap and do-not-mail addresses are marked `bounced`; catch-all and unknown addresses are skipped as risky. If ZeroBounce itself is unavailable the unchecked addresses are skipped too, never sent unverified. Verdicts are remembered platform-wide, so an address validated in the last 30 days (90 for invalid, 7 for risky) is not checked again.
2. **Rate-limited delivery** — emails are sent through SendGrid at 10/second to avoid spam-filter triggers.
3. **Token generation** — each recipient gets a unique token appended to the survey URL so the response ties back to them.
4. **Bounce handling** — hard bounces, drops and spam reports are recorded by the SendGrid event webhook, mark the recipient `bounced` or `unsubscribed`, and add the address to the team's suppression list so it is never mailed again.

### Sending limits

Every team shares the same sending identity, so the platform protects its sender reputation with a weekly budget:

| Limit | Default | Scope |
|---|---|---|
| Invitations + reminders per week | 100 | Per team, across all surveys, resets Monday 00:00 UTC |
| Per conversation, per survey | 50 | Agent and MCP sends only |
| Delivery rate | 10 / second | Platform-wide |

A send that would exceed the weekly budget is refused **before any email goes out** with a `429` and code `email_weekly_cap_exceeded`. The list stays in `pending`, so you can send it once the budget resets or is raised. The error body carries `used`, `attempted`, `remaining` and `resets_at`:

```json
{
  "error": {
    "code": "email_weekly_cap_exceeded",
    "message": "This team has reached its weekly email limit of 100 invitations (80 already sent this week, 40 more attempted, 20 remaining). The limit resets on Monday 26 Oct at 00:00 UTC. For larger distributions, please reach out to help@flashpoint.ai.",
    "details": { "cap": 100, "used": 80, "attempted": 40, "remaining": 20, "resets_at": "2026-10-26T00:00:00+00:00" }
  }
}
```

Need more? Email [help@flashpoint.ai](mailto:help@flashpoint.ai) with your team and expected volume; the limit is raised per team.

Every invitation also carries a one-click unsubscribe header and an opt-out link. Recipients who unsubscribe, bounce or report spam are suppressed for the whole team, and the suppression is applied automatically when you create a list or send to a panel.

### Overriding the template for one send

Pass `email_template` in the send body to override the saved template for this send only:

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base_survey_url": "https://flashpointopinions.com/{survey_id}",
    "email_template": {
      "subject": "Last chance: share your feedback",
      "body": "Hi,\n\nThis is your final reminder.\n\n{{SURVEY_LINK}}\n\nThank you!",
      "cta_text": "Take the survey now"
    }
  }'
```

### Via the agent

> "Send the email list to my survey recipients"

The agent calls `send_email_list`. Because sending is destructive (emails go out immediately), the agent presents an approval card before executing.

## Tracking

### Per-recipient status

```bash
curl "https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/recipients?page=1&per_page=50" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "recipients": [
    {
      "id": "rec_...",
      "email": "anna@example.com",
      "status": "completed",
      "validation_status": "valid",
      "sent_at": "2026-05-26T14:05:00Z",
      "last_sent_at": "2026-05-26T14:05:00Z",
      "send_count": 1,
      "started_at": "2026-05-26T15:10:00Z",
      "completed_at": "2026-05-26T15:14:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "per_page": 50
}
```

Filter by status with the `status` query parameter:

```bash
# Only recipients who haven't completed
curl "...?status=sent"
```

### Recipient lifecycle

```text
pending --> sent --> clicked --> completed
                 \-> bounced
```

| Status | Meaning |
|---|---|
| `pending` | Added to list, not yet sent |
| `sent` | Email delivered |
| `clicked` | Recipient opened the survey link |
| `completed` | Survey response submitted |
| `bounced` | Delivery failed (hard or soft bounce) |

### Summary statistics

```bash
curl "https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/stats" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "total": 100,
  "pending": 5,
  "sent": 30,
  "started": 15,
  "completed": 45,
  "bounced": 5
}
```

## Resending

Send reminders to recipients who have not completed the survey.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/resend \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base_survey_url": "https://flashpointopinions.com/{survey_id}",
    "filter": "non_complete"
  }'
```

### Filter options

| Filter | Recipients included |
|---|---|
| `non_complete` | Everyone who has not completed (pending + sent + started + bounced). Default. |
| `pending` | Only recipients whose email was never sent |
| `sent` | Only recipients who received the email but have not started |
| `specific` | Only the `recipient_ids` you specify |

### Specific-recipient resend

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/resend \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base_survey_url": "https://flashpointopinions.com/{survey_id}",
    "filter": "specific",
    "recipient_ids": ["rec_abc123", "rec_def456"]
  }'
```

Resends reuse existing tokens (same survey link per recipient) and skip ZeroBounce re-validation.

### Via the agent

> "Resend the invitation to everyone who hasn't completed yet"

## Adding recipients

Append new contacts to an existing email list after the initial send.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/email-lists/{list_id}/recipients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emails": [
      {"email": "newuser@example.com", "name": "New User"}
    ]
  }'
```

Response:

```json
{
  "list_id": "el_a1b2c3d4-...",
  "added": 1,
  "skipped_duplicates": 0,
  "total_count": 4
}
```

New recipients are automatically validated and sent using the same pipeline as the initial send. Emails that already exist on the list are silently skipped (case-insensitive match).

## Platform email

The `send_platform_email` tool sends platform-generated files (survey exports, reports, CSV data) to stakeholders. This is not a survey invitation — it is for sharing deliverables.

### Requirements

- At least one attachment is required (an `s3_key` from a prior `export_csv`, `export_docx`, or `export_pdf` call).
- Maximum 10 recipients (to + cc combined).
- Maximum 5 attachments, 25 MB total.
- Recipients are validated via ZeroBounce before sending.

### Via the agent

> "Email the CSV export of this survey to stakeholder@company.com"

The agent first runs the export, captures the S3 key, then calls `send_platform_email` with the attachment. An approval card is presented before sending.

## Next steps

- See the overview of all channels: **[Distribute](/surveys-distribute)**.
- Analyze incoming responses: **[Analyze](/surveys-analyze)**.
- Check response quality: **[Data quality](/data-quality)**.


---

# Analyze

Every response lands in the same store regardless of how it was collected. The API surfaces summary dashboards, per-question frequencies, crosstabs, NPS, statistical tests, AI takeaways, and individual response management.

## Summary dashboard

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "total_responses": 247,
  "complete": 210,
  "incomplete": 30,
  "screen_out": 7,
  "completion_rate": 85.0,
  "median_time_seconds": 312,
  "daily_timeline": [
    {"date": "2026-05-20", "count": 42},
    {"date": "2026-05-21", "count": 58},
    {"date": "2026-05-22", "count": 67}
  ],
  "country_breakdown": [
    {"country": "US", "count": 180},
    {"country": "GB", "count": 35},
    {"country": "CA", "count": 32}
  ]
}
```

Filter by survey version or panel:

```bash
# Only Prolific responses
curl "...?panel_id={prolific_panel_id}"

# Only public-link traffic
curl "...?panel_id=open"
```

### Via the agent

> "How are results coming for my NPS survey?"

The agent calls `get_analytics` and summarizes the headline metrics.

## Frequencies

Answer distribution for every question, or for a single question.

### All questions

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/frequencies \
  -H "Authorization: Bearer $TOKEN"
```

Response (array of frequency objects):

```json
[
  {
    "question_id": "Q1",
    "label": "Q1",
    "text": "What is your age group?",
    "type": "select",
    "total_responses": 210,
    "distribution": [
      {"value": "18-24", "count": 42, "percentage": 20.0},
      {"value": "25-34", "count": 68, "percentage": 32.4},
      {"value": "35-44", "count": 55, "percentage": 26.2},
      {"value": "45+",   "count": 45, "percentage": 21.4}
    ]
  }
]
```

### Single question

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/frequencies/Q1 \
  -H "Authorization: Bearer $TOKEN"
```

### Via the agent

> "Show me the breakdown for Q1"

The agent calls `get_frequencies` with `question_label="Q1"`.

## Crosstabs

Two-dimensional cross-tabulation with chi-square, Cramer's V, and adjusted standardized residuals. Supports 2-way and 3-way (banner variable) analysis.

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/crosstab \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rowVariable": {"questionLabel": "Q4"},
    "colVariable": {"questionLabel": "Q1"}
  }'
```

Response:

```json
{
  "status": "success",
  "tables": {
    "Total": {
      "rows": [
        {
          "value": "Very satisfied",
          "18-24": {"count": 15, "rowPct": 35.7, "colPct": 22.1},
          "25-34": {"count": 22, "rowPct": 52.4, "colPct": 32.4},
          "total": {"count": 42}
        }
      ],
      "statistics": {
        "chiSquare": 12.45,
        "pValue": 0.0142,
        "cramersV": 0.24,
        "sampleSize": 210
      }
    }
  }
}
```

### 3-way crosstab (banner variable)

Add a `bannerVariable` to segment the table:

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/crosstab \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rowVariable": {"questionLabel": "Q4"},
    "colVariable": {"questionLabel": "Q1"},
    "bannerVariable": {"questionLabel": "Q2"}
  }'
```

Returns one table per banner category plus a "Total" table.

### Available crosstab questions

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/crosstab/questions \
  -H "Authorization: Bearer $TOKEN"
```

Returns all questions eligible as crosstab variables. Free-text, conjoint, and van-westendorp questions are excluded since they do not produce categorical buckets.

### Via the agent

> "Crosstab satisfaction by age group"

The agent calls `get_crosstab` with `row_label="Q4"` and `column_label="Q1"`.

## NPS

Net Promoter Score for NPS-type questions.

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/nps/Q3 \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "question_id": "Q3",
  "nps_score": 32.5,
  "total": 210,
  "promoters": 95,
  "promoter_pct": 45.2,
  "passives": 63,
  "passive_pct": 30.0,
  "detractors": 52,
  "detractor_pct": 24.8
}
```

NPS = % Promoters (9-10) minus % Detractors (0-6). Range: -100 to +100.

| Bucket | Score range |
|---|---|
| Promoter | 9-10 |
| Passive | 7-8 |
| Detractor | 0-6 |

### Via the agent

> "What's our NPS?"

The agent calls `get_nps` with the NPS question label from the survey.

## Statistical testing

Chi-square test of independence on any two categorical variables.

### Via the agent

> "Is the difference in brand preference between males and females statistically significant?"

The agent calls `stat_test` with the two question labels. Response:

```json
{
  "test": "chi_square_independence",
  "row_question": "Q2",
  "column_question": "Q5",
  "chi_square": 18.3421,
  "p_value": 0.002614,
  "degrees_of_freedom": 6,
  "interpretation": "Highly significant -- strong evidence of association (p < 0.01)",
  "sample_size": 210,
  "segment_filter": null
}
```

Interpretation thresholds:

| p-value | Interpretation |
|---|---|
| < 0.01 | Highly significant — strong evidence of association |
| < 0.05 | Statistically significant at 95% confidence |
| < 0.10 | Marginally significant — suggestive but not conclusive |
| >= 0.10 | Not statistically significant |

## Segment filtering

Slice any analytics query to a subgroup using the DSL filter syntax — the same expression language used for skip logic.

### Examples

```text
Q1 == `1`              -- only respondents who picked option 1 on Q1
Q2 IN [`1`,`2`]        -- Q2 is option 1 or 2
Q7 > 50               -- numeric Q7 greater than 50
```

Pass the filter as a query parameter (REST) or `segment_filter` argument (agent tools).

### Via the agent

> "Show me NPS for respondents aged 25-34"

The agent adds `segment_filter="Q1 == '2'"` (assuming Q1 option 2 is the 25-34 age band) to the `get_nps` call.

## Response management

### List responses

```bash
curl "https://api.flashpoint.ai/api/v1/surveys/{survey_id}/responses?status=complete&limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "total": 210,
  "responses": [
    {
      "id": "resp_...",
      "survey_id": "srv_...",
      "status": "COMPLETE",
      "country": "US",
      "started_at": "2026-05-20T10:00:00Z",
      "completed_at": "2026-05-20T10:05:12Z",
      "time_elapsed_ms": 312000,
      "is_preview": false,
      "excluded": false
    }
  ]
}
```

### Get response detail

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/responses/{response_id} \
  -H "Authorization: Bearer $TOKEN"
```

Returns the full answer data, geo, panel info, fraud signals, and exclusion status.

### Exclude a response

```bash
curl -X PATCH https://api.flashpoint.ai/api/v1/surveys/{survey_id}/responses/{response_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "excluded": true,
    "reason": "Suspected bot -- completed in 8 seconds"
  }'
```

Excluded responses remain in the database (re-include by setting `excluded: false`) but are removed from all analytics views by default.

### Bulk exclusion

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/responses/bulk \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "exclude",
    "response_ids": ["resp_abc", "resp_def", "resp_ghi"],
    "reason": "Straightlining detected"
  }'
```

The `action` field accepts `exclude` or `include`.

### Via the agent

> "Exclude that response — it's a bot"

The agent calls `exclude_response` with `excluded=true` and the reason you provide.

## Reports

### Structured JSON report

```bash
curl "https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/report?include_takeaways=true" \
  -H "Authorization: Bearer $TOKEN"
```

Returns a composite document with summary, per-question frequencies, and (optionally) AI key takeaways in one payload.

```json
{
  "survey": {
    "id": "srv_...",
    "title": "Customer Satisfaction Q2",
    "status": "active",
    "version": 3
  },
  "generated_at": "2026-05-26T14:00:00Z",
  "summary": { "...summary dashboard fields..." },
  "questions": [ "...frequency objects per question..." ],
  "key_takeaways": { "...AI takeaways (if requested)..." }
}
```

### PDF report download

```bash
curl -o report.pdf \
  "https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/report/download" \
  -H "Authorization: Bearer $TOKEN"
```

Returns `application/pdf` with quota disposition and overall metrics.

## Exports

The agent can export survey data in multiple formats:

| Format | Tool | Content |
|---|---|---|
| CSV | `export_csv` | Response data — one row per respondent |
| DOCX | `export_docx` | Survey instrument — questions, options, logic |
| PDF | `export_pdf` | Survey instrument — polished, non-editable |

Each export uploads to S3 and returns a presigned download URL valid for 1 hour.

### Via the agent

> "Export the responses as CSV"

> "Give me a Word doc of the survey instrument"

## Next steps

- AI-powered insights: **[AI insights](/analyze-ai)**.
- Clean up bad data: **[Data quality](/data-quality)**.
- Send results to stakeholders: **[Email distribution](/distribute-email)**.


---

# AI insights

Flashpoint.AI analyzes survey data directly — theme extraction from open-ended responses, executive summaries with evidence, survey quality scoring, and web research to ground survey design in real-world context.

## Open-end analysis

The `analyze_open_ends` tool reads free-text responses for a single question and returns themes, sentiment, notable quotes, and actionable insights.

### Via the agent

> "Analyze the open-ended responses for Q5"

The agent calls `analyze_open_ends` with the question label. It fetches up to 100 completed, non-excluded text responses (configurable up to 500) and sends them to Flashpoint.AI's AI for qualitative analysis.

### Response shape

```json
{
  "total_analyzed": 87,
  "themes": [
    {
      "theme": "Delivery speed",
      "count": 34,
      "percentage": 39.1,
      "example": "The package arrived two days early, which was great"
    },
    {
      "theme": "Packaging quality",
      "count": 22,
      "percentage": 25.3,
      "example": "Box was damaged when it arrived"
    }
  ],
  "sentiment": {
    "positive": 48.3,
    "negative": 31.0,
    "neutral": 20.7
  },
  "notable_quotes": [
    {
      "text": "Best customer service I've experienced in years",
      "theme": "Customer service"
    },
    {
      "text": "Had to call three times before anyone helped",
      "theme": "Customer service"
    }
  ],
  "insights": [
    {
      "finding": "Delivery speed is the top driver of positive sentiment",
      "implication": "Investing in faster shipping may improve overall satisfaction scores"
    },
    {
      "finding": "Packaging complaints correlate with repeat-purchase hesitancy",
      "implication": "Packaging improvements could reduce churn in the 25-34 segment"
    }
  ]
}
```

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `question_label` | (required) | Label of the open-ended question (e.g. `Q9`) |
| `max_responses` | 100 | Maximum responses to analyze (1-500) |

Only works on text-type questions. The tool filters to `COMPLETE` responses that are not excluded or previews.

## Results summary

The `summarize_results` tool generates an executive summary of the entire survey — structured topic clusters with evidence, suitable for a dashboard "AI Insights" panel.

### Via the agent

> "Give me the key takeaways from this survey"

> "Summarize what we learned"

### REST endpoint

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/analytics/key-takeaways \
  -H "Authorization: Bearer $TOKEN"
```

### Response shape

```json
{
  "keyPoints": [
    "NPS is driven by delivery speed, not product quality",
    "The 35-44 segment is the most price-sensitive",
    "Awareness is high (87%) but trial is low (12%)"
  ],
  "overallSummary": "The survey reveals strong brand awareness across all segments but a significant gap between awareness and trial. Delivery speed emerges as the primary driver of satisfaction, while pricing concerns are concentrated in the 35-44 age band. Open-ended feedback highlights packaging as an underappreciated pain point.",
  "topics": [
    {
      "topic": "Delivery Experience",
      "summary": "Fast delivery is the strongest predictor of promoter status",
      "positiveCount": 95,
      "negativeCount": 23,
      "evidence": [
        {
          "type": "stat",
          "text": "72% of promoters cite delivery speed as top factor",
          "sentiment": "positive"
        },
        {
          "type": "quote",
          "text": "Arrived two days early -- will order again",
          "sentiment": "positive"
        },
        {
          "type": "stat",
          "text": "Late delivery mentioned in 61% of detractor open-ends",
          "sentiment": "negative"
        }
      ]
    }
  ]
}
```

### Field reference

| Field | Type | Description |
|---|---|---|
| `keyPoints` | `string[]` | Exactly 3 short bullet points (max 15 words each) |
| `overallSummary` | `string` | 3-4 sentence paragraph |
| `topics` | `object[]` | 4-6 topic clusters |
| `topics[].topic` | `string` | Short topic name (2-4 words) |
| `topics[].summary` | `string` | One-sentence summary |
| `topics[].positiveCount` | `int` | Count of positive signals (0 for neutral topics) |
| `topics[].negativeCount` | `int` | Count of negative signals (0 for neutral topics) |
| `topics[].evidence` | `object[]` | 2-4 evidence items |
| `topics[].evidence[].type` | `string` | `stat` or `quote` |
| `topics[].evidence[].text` | `string` | Evidence text (under 100 chars) |
| `topics[].evidence[].sentiment` | `string` | `positive`, `negative`, or `neutral` |

The endpoint returns `{"error": true, "message": "..."}` with empty arrays when there are no responses or the AI service is unavailable.

## Survey optimization

The `optimize_survey` tool performs an AI quality review before publishing. It checks for methodological issues and returns a score with specific, actionable suggestions.

### Via the agent

> "Review my survey for quality issues"

> "Is this survey ready to publish?"

### Response shape

```json
{
  "score": 78,
  "estimated_minutes": 6.5,
  "issues": [
    {
      "severity": "high",
      "question": "Q4",
      "type": "bias",
      "description": "Leading question -- 'Don't you agree that...' pushes respondents toward agreement"
    },
    {
      "severity": "medium",
      "question": "Q7",
      "type": "cognitive_load",
      "description": "Grid has 12 rows and 7 columns -- respondents will fatigue before row 8"
    },
    {
      "severity": "low",
      "question": null,
      "type": "missing_type",
      "description": "No open-ended question -- consider adding one for qualitative depth"
    }
  ],
  "suggestions": [
    {
      "question": "Q4",
      "action": "Rephrase to neutral wording: 'To what extent do you agree or disagree that...'",
      "rationale": "Neutral framing avoids acquiescence bias and produces more valid data"
    },
    {
      "question": "Q7",
      "action": "Split into two grids of 6 rows each",
      "rationale": "Shorter grids reduce straightlining and improve data quality"
    }
  ]
}
```

### Issue types

| Type | What it catches |
|---|---|
| `bias` | Leading, loaded, or suggestive question wording |
| `clarity` | Ambiguous or double-barreled questions |
| `ordering` | Question sequence issues (e.g. priming effects) |
| `cognitive_load` | Too many options, overly complex grids |
| `missing_type` | No screener, no open-ended, no demographics |
| `logic_gap` | Skip logic that leaves dead paths |

## Research tools

Three tools gather real-world context before or during survey design. They use web search to return synthesized answers with citations.

### research_market

Research a market, industry, or topic.

> "What are the customer satisfaction drivers for specialty coffee shops?"

### research_audience

Research a target audience's demographics, psychographics, and behavior patterns.

> "What defines Gen Z sneaker buyers in terms of purchase drivers?"

### research_competitors

Research competitors in an industry or product category.

> "Who are the main competitors in the US home insurance market and how are they positioned?"

### Response shape (all three tools)

```json
{
  "available": true,
  "query": "Customer satisfaction drivers for specialty coffee shops",
  "provider": "perplexity",
  "answer": "The primary drivers of customer satisfaction in specialty coffee are...",
  "citations": [
    {
      "title": "2025 Specialty Coffee Consumer Report",
      "url": "https://example.com/report",
      "snippet": "Quality of beans and brewing consistency ranked highest..."
    }
  ]
}
```

When the research service is not configured, the tool returns `{"available": false}` and the agent falls back to its built-in knowledge.

### Persisting research sources

After building a survey from research, the agent calls `attach_research_sources` to store citations on the survey. These persist in `survey.settings.research_sources` and are visible on the survey overview.

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id} \
  -H "Authorization: Bearer $TOKEN"
```

The `settings.research_sources` array in the response contains the stored citations.

### Typical research flow

1. `research_audience` — understand who you are surveying
2. `research_market` — understand the domain context
3. Plan and create the survey
4. `attach_research_sources` — persist the citations on the survey

## Next steps

- Core analytics and exports: **[Analyze](/surveys-analyze)**.
- Clean up bad data: **[Data quality](/data-quality)**.
- Distribute the survey: **[Distribute](/surveys-distribute)**.


---

# Data quality

Detect suspicious responses, validate survey logic before publishing, and generate test data for QA. These tools help you maintain clean data and catch instrument issues early.

## Speeders

The `detect_speeders` tool finds responses completed faster than a threshold you set. Unrealistically fast completions typically indicate bots or respondents who clicked through without reading.

### Via the agent

> "Find responses completed in under 60 seconds"

> "Check for speeders with a 2-minute threshold"

The agent calls `detect_speeders` with the threshold in seconds. It scans completed, non-excluded, non-preview responses.

### Response shape

```json
{
  "threshold_seconds": 60,
  "total_complete_responses": 210,
  "speeders_found": 8,
  "speeders": [
    {
      "response_id": "resp_abc123",
      "time_seconds": 12.3
    },
    {
      "response_id": "resp_def456",
      "time_seconds": 28.7
    },
    {
      "response_id": "resp_ghi789",
      "time_seconds": 45.1
    }
  ]
}
```

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `threshold_seconds` | 60 | Flag responses faster than this (minimum 5 seconds) |

Results are capped at 50 speeders in the response and ordered by completion time (fastest first).

### Choosing a threshold

The right threshold depends on survey length. A 5-question screener might legitimately take 30 seconds; a 40-question study should take several minutes. Use the median completion time from the [summary dashboard](/surveys-analyze) as a baseline and set the threshold at roughly one-third of the median.

## Straightliners

The `detect_straightliners` tool finds respondents who gave the same answer to every row in grid-type questions. Straightlining is one of the most common indicators of inattentive responding.

### Via the agent

> "Check for straightlining in my survey"

> "Are any respondents giving the same answer on every grid row?"

The agent calls `detect_straightliners`. It requires at least 2 grid questions in the survey to run (configurable via `min_grid_questions`).

### Response shape

```json
{
  "grid_questions_checked": ["Q5", "Q8", "Q12"],
  "total_responses_scanned": 210,
  "straightliners_found": 5,
  "straightliners": [
    {
      "response_id": "resp_abc123",
      "grids_straightlined": 3,
      "total_grids": 3
    },
    {
      "response_id": "resp_def456",
      "grids_straightlined": 2,
      "total_grids": 3
    }
  ]
}
```

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `min_grid_questions` | 2 | Minimum grid questions needed for detection (1-N) |

The tool scans up to 1,000 completed, non-excluded responses. Results are capped at 50 straightliners.

A respondent is flagged only if they straightline across at least `min_grid_questions` grids — a single grid with identical answers could be a legitimate response pattern.

## Response exclusion

After identifying bad data through speeders, straightliners, or manual review, exclude responses from analytics.

### Single response

```bash
curl -X PATCH https://api.flashpoint.ai/api/v1/surveys/{survey_id}/responses/{response_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "excluded": true,
    "reason": "Completed in 12 seconds -- suspected bot"
  }'
```

Response:

```json
{
  "response_id": "resp_abc123",
  "excluded": true,
  "reason": "Completed in 12 seconds -- suspected bot"
}
```

### Bulk exclusion

```bash
curl -X POST https://api.flashpoint.ai/api/v1/surveys/{survey_id}/responses/bulk \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "exclude",
    "response_ids": ["resp_abc123", "resp_def456", "resp_ghi789"],
    "reason": "Straightlining detected across all grid questions"
  }'
```

Response:

```json
{
  "action": "exclude",
  "affected": 3,
  "response_ids": ["resp_abc123", "resp_def456", "resp_ghi789"]
}
```

### Re-including responses

Set `excluded: false` on the single-response endpoint or use `"action": "include"` on the bulk endpoint. Excluded responses remain in the database and can always be restored.

### Via the agent

> "Exclude those 8 speeders"

The agent calls `exclude_response` for each flagged response. Because exclusion changes downstream analytics numbers, the agent presents an approval card before executing.

### Typical quality workflow

1. Run `detect_speeders` and `detect_straightliners` to identify suspects.
2. Review flagged responses with `get_response` if needed.
3. Exclude bad data with `exclude_response` (single) or the bulk endpoint.
4. Re-run analytics — excluded responses are automatically filtered out.

## Test data

The `generate_test_data` tool creates random junk responses for QA purposes. This is useful for testing the response pipeline, verifying analytics charts render correctly, and validating export functionality.

### Via the agent

> "Generate 20 test responses for my survey"

> "Fill this survey with fake data for a demo"

The agent calls `generate_test_data` with `count=20`. The tool has a strict guard: it requires an explicit user request for fake data and will refuse if the intent is ambiguous.

### Response shape

```json
{
  "survey_id": "srv_...",
  "generated": 20,
  "note": "Test responses visible in analytics. Use exclude_response to clean up later."
}
```

### Parameters

| Parameter | Default | Description |
|---|---|---|
| `count` | 20 | Number of fake responses to generate (1-200) |

### What gets generated

The tool reads the survey document and generates type-appropriate random answers:

| Question type | Generated answer |
|---|---|
| `select` (single) | Random option |
| `select` (multi) | 1-3 random options |
| `nps` | Random 0-10 |
| `number` | Random within configured data range |
| `text` | Random sample phrase |
| `grid` | Random horizontal option per vertical row |
| `ranking` | Shuffled option order |
| `van-westendorp` | Four price points in valid order |
| `maxdiff` | Random best/worst per task |
| `conjoint` | Random profile selection per task |

Each response gets a random completion time between 30 seconds and 10 minutes.

### Cleanup

Test responses are visible in analytics immediately. To clean them up:

- Use `exclude_response` on individual test responses.
- Use the bulk exclusion endpoint to exclude all at once.
- Or delete the survey and start fresh.

### Important: test data vs. synthetic panels

`generate_test_data` creates random noise for QA. It is not the same as synthetic panel responses, which use AI personas with realistic demographics and personality-driven answers. If you want a synthetic panel to take the survey, use the synthetic panel flow instead (see [Synthetic panels](/sample-synthetic)).

## Pre-publish validation

The `spellcheck` endpoint validates a survey's DSL logic before publishing. It catches broken references, invalid expressions, and unreachable questions. (The surveys agent calls this internally under the tool name `surveycheck`.)

### REST endpoint

```bash
curl https://api.flashpoint.ai/api/v1/surveys/{survey_id}/spellcheck \
  -H "Authorization: Bearer $TOKEN"
```

### Response shape

```json
{
  "unknown_identifiers": [
    {
      "question": "Q5",
      "location": "skip_condition",
      "dsl": "Q99 == `1`",
      "unknown": "Q99",
      "correction": "Q9"
    }
  ],
  "invalid_dsls": [
    {
      "question": "Q8",
      "location": "display_condition",
      "dsl": "Q3 ==== `1`"
    }
  ],
  "unreachable_questions": [
    {
      "label": "Q12",
      "reason": "All paths skip past this question"
    }
  ],
  "post_logic_identifiers": [
    {
      "question": "Q15",
      "unknown": "Q99"
    }
  ]
}
```

### Check categories

| Category | What it catches |
|---|---|
| `unknown_identifiers` | Labels in skip/display logic that do not match any question (with suggested corrections) |
| `invalid_dsls` | Skip or display conditions that fail to parse |
| `unreachable_questions` | Questions that can never be shown due to logic conflicts |
| `post_logic_identifiers` | Variable definition references to non-existent labels |

### Via the agent

> "Check my survey for logic errors before publishing"

The agent calls `surveycheck` after significant edits and before recommending publish. An empty response (all arrays empty) means the survey is clean.

### DSL validation

For validating individual expressions before applying them:

```bash
# Validate via the agent's validate_dsl tool
# Returns: {"valid": true, "identifiers": ["Q1", "Q3"]}
# Or:      {"valid": false, "error": "Unexpected token at position 5", "identifiers": []}
```

The agent uses this proactively when building complex skip logic to catch syntax errors before they reach the survey document.

## Next steps

- Analyze clean data: **[Analyze](/surveys-analyze)**.
- AI-powered insights: **[AI insights](/analyze-ai)**.
- Distribute to more respondents: **[Distribute](/surveys-distribute)**.


---

# Import & export

Bring existing surveys into Flashpoint.AI from Word documents, and export data, instruments, and platform files in the format your downstream tools need.

## Import

### DOCX upload

Upload a `.docx` questionnaire — a paper survey, legacy Word file, vendor handoff — and Flashpoint.AI programs it into a live survey automatically. The AI pipeline reads the document structure, identifies questions, applies logic and routing, validates the result, and lands a draft you can review.

**Endpoint**

```
POST /api/v1/imports/docx
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | binary | Yes | `.docx` file, 10 MB max |
| `output_format` | string | No | Target platform writer. Default: `decipher` |
| `conversation_id` | UUID | No | Chat conversation to receive progress events |
| `notify_email` | string | No | Email address for completion notification |

**Example**

```bash
curl -X POST https://api.flashpoint.ai/api/v1/imports/docx \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@survey-spec.docx" \
  -F "output_format=decipher" \
  -F "notify_email=researcher@company.com"
```

**Response** (immediate — the actual import runs asynchronously)

```json
{
  "job_id": "a1b2c3d4-...",
  "artifact_id": "a1b2c3d4-...",
  "state": "pending",
  "output_format": "decipher",
  "conversation_id": "e5f6a7b8-...",
  "filename": "survey-spec.docx",
  "title": "survey-spec.docx"
}
```

### Polling for status

```
GET /api/v1/imports/{job_id}
```

```bash
curl https://api.flashpoint.ai/api/v1/imports/a1b2c3d4-... \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "job_id": "a1b2c3d4-...",
  "state": "completed",
  "output_format": "decipher",
  "survey_id": "f8e7d6c5-...",
  "error": null,
  "started_at": "2026-05-26T10:01:00Z",
  "completed_at": "2026-05-26T10:07:42Z"
}
```

### Job states

| State | Meaning |
|---|---|
| `pending` | Queued, waiting for a worker |
| `processing` | Pipeline running (reading, understanding, programming, validating) |
| `completed` | Survey created successfully — `survey_id` is populated |
| `failed` | Pipeline error — `error` contains details |

### What the pipeline does

| Stage | Description |
|---|---|
| **Reading** | Renders the `.docx` to a structured representation. Tables, formatting, and section markers are preserved. |
| **Understanding** | Identifies sections — screener, demographics, body, terminations — and estimates question counts. |
| **Programming** | One focused AI call per question. Determines type, options, logic targets, and any quotas. |
| **Validating** | Structural checks: option sets have at least two options, skip targets resolve, types match schemas. |
| **Auto-fixing** | Known-fixable issues (empty options, orphan skip targets, missing terminations) are rewritten and re-validated. |

Processing typically takes 5-10 minutes for a real-world questionnaire.

### Via the agent

Upload a `.docx` in the chat interface, or tell the agent:

> "Upload this survey spec and program it"

The agent shows a progress card that ticks through each stage live.

---

## Export formats

Flashpoint.AI supports exporting survey data and instruments in multiple formats. Some exports are synchronous (the response body is the file); others are asynchronous (you get a job ID and poll or wait for an event).

### Format reference

| Format | Endpoint | Method | Mode | Description |
|---|---|---|---|---|
| **CSV** | `/api/v1/surveys/{id}/exports/csv` | GET | Sync | SPSS-compatible wide format, one column per option |
| **XLSX** | `/api/v1/surveys/{id}/exports/xlsx` | GET | Sync | Wide format with a Questions codebook sheet |
| **PDF** | `/api/v1/surveys/{id}/exports/pdf` | GET | Sync | Survey instrument as a PDF document |
| **DOCX** | `/api/v1/surveys/{id}/exports/docx` | GET | Sync | Survey instrument as a Word document |
| **Confirmit XML** | `/api/v1/surveys/{id}/exports/confirmit` | GET | Sync | Confirmit-compatible XML inside a ZIP archive |
| **Qualtrics QSF** | `/api/v1/surveys/{id}/exports/qualtrics` | POST | Async | Qualtrics survey file |
| **Forsta XML** | `/api/v1/surveys/{id}/exports/forsta` | POST | Async | Forsta-compatible XML |

### CSV export

SPSS-compatible wide-format CSV with a two-row header (question label group + column IDs). One column per option, grid row, MaxDiff set, etc.

```bash
curl -o responses.csv \
  "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/csv?with_labels=false" \
  -H "Authorization: Bearer $TOKEN"
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `version` | integer | current | Specific survey version number |
| `with_labels` | boolean | `false` | `false`: cells contain option IDs (SPSS codes). `true`: cells contain display text. |

### XLSX export

Same wide-format layout as CSV, plus a **Questions** codebook sheet documenting every question and its options.

```bash
curl -o responses.xlsx \
  "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/xlsx?with_labels=true" \
  -H "Authorization: Bearer $TOKEN"
```

Parameters are identical to CSV.

### PDF export

Exports the survey instrument (questions, options, logic) as a formatted PDF. This is the survey design, not response data — useful for stakeholder review, IRB submissions, or archival.

```bash
curl -o instrument.pdf \
  "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/pdf" \
  -H "Authorization: Bearer $TOKEN"
```

### DOCX export

Survey instrument as a Word document. Stakeholders can review, mark up, and share offline.

```bash
curl -o instrument.docx \
  "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/docx" \
  -H "Authorization: Bearer $TOKEN"
```

### Confirmit XML export

Generates Confirmit-compatible XML with team-specific customizations (CATI templates, form logic, USW splits) applied automatically. Returned as a ZIP archive.

```bash
curl -o confirmit.zip \
  "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/confirmit" \
  -H "Authorization: Bearer $TOKEN"
```

### Async exports (Qualtrics, Forsta)

Qualtrics QSF and Forsta XML exports run asynchronously. You receive a job ID and poll for completion.

```bash
curl -X POST \
  "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/qualtrics" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

```json
{
  "export_id": "b2c3d4e5-...",
  "format": "qualtrics_qsf",
  "status": "pending",
  "message": "Qualtrics QSF export requested."
}
```

The generic async export endpoint also supports all formats:

```
POST /api/v1/surveys/{id}/exports
```

```json
{
  "format": "csv",
  "version": null,
  "filters": { "status": "COMPLETE", "date_from": "2026-01-01" },
  "options": { "include_open_ended": true }
}
```

---

## Pre-check

Before triggering an export, validate that it will succeed. The pre-check endpoint returns blockers (hard stops) and warnings (informational).

```
GET /api/v1/surveys/{id}/exports/precheck?format=csv
```

```bash
curl "https://api.flashpoint.ai/api/v1/surveys/$SURVEY_ID/exports/precheck?format=csv" \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "ok": true,
  "format": "csv",
  "total_responses": 847,
  "blockers": [],
  "warnings": []
}
```

**Possible blockers:**
- `"Survey has no responses to export."`
- `"Unsupported format 'xyz'."`

**Possible warnings:**
- `"Large export (150,000 responses) — may take several minutes to build."`
- `"Low completion rate (8%) — many responses are incomplete."`

---

## Document generation

The agent can compose free-form documents from platform data — analysis summaries, methodology writeups, stakeholder memos. These are distinct from the fixed-template instrument exports above.

### Formats

| Tool | Output | Use case |
|---|---|---|
| `generate_docx` | Word document (.docx) | Narrative reports, methodology docs, memos. Sections with headings, paragraphs, and tables. |
| `generate_xlsx` | Excel workbook (.xlsx) | Multi-sheet tabular data. Numeric types preserved for formulas. |
| `generate_csv` | CSV file (.csv) | Simple flat tables — response dumps, recipient lists. |
| `generate_pdf` | PDF document (.pdf) | Polished final reports. Same input shape as `generate_docx`. |

All generated documents are uploaded to S3 and returned as presigned download URLs valid for 1 hour. The chat displays a preview card with inline content.

### Agent examples

> "Generate a Word report summarizing the survey results with charts and takeaways"

The agent fetches the analytics data, composes a structured document with sections, tables, and narrative, and produces a downloadable `.docx`.

> "Export the response data as an Excel file with separate sheets for each question"

The agent calls `generate_xlsx` with one sheet per question, headers as option labels, and rows as response counts.

> "Create a PDF summary I can send to the client"

The agent composes a polished PDF with title, executive summary, key findings, and detailed breakdowns.

### How it differs from export endpoints

| | Export endpoints | Document generation |
|---|---|---|
| **Content** | Fixed template — survey instrument or raw response data | Free-form — agent composes narrative, tables, analysis |
| **Access** | Direct HTTP endpoints | Agent tool calls (via chat or API) |
| **Customization** | Query parameters (`with_labels`, `version`) | Natural language ("include only Q1-Q5", "add an executive summary") |

### Sending generated documents by email

After generating a document, the agent can email it to stakeholders using the `send_platform_email` tool. This requires at least one attachment and supports up to 10 recipients and 5 attachments per send. The send requires explicit approval before executing.

> "Generate the results summary as a PDF and email it to team@company.com"


---

# Ask the agent

The agent is the primary interface for the Flashpoint.AI survey platform. Describe what you want in plain language, and the agent plans the work, calls the right tools, and asks for confirmation before anything destructive.

## How it works

You send a natural-language message. The agent reads it alongside the current survey context, decides which tools to call, executes them, and streams results back. The entire interaction runs over a single SSE (Server-Sent Events) connection.

**Endpoint**

```
POST /api/v1/agent/chat
Content-Type: application/json
```

```json
{
  "message": "Create a 10-question NPS survey for our Q3 product launch",
  "conversation_id": null,
  "survey_id": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | Your instruction in natural language |
| `conversation_id` | UUID | No | Continue an existing conversation. Omit to start a new one. |
| `survey_id` | UUID | No | Scope the conversation to a specific survey |

The response is an SSE stream. Each frame is a JSON event with a `type` field:

| Event type | When it fires | Payload |
|---|---|---|
| `conversation_started` | Immediately | `conversation_id`, `survey_id` |
| `thinking` | Agent is reasoning | Internal reasoning text |
| `text` | Agent is composing a response | Streamed text chunks |
| `tool_call` | Agent invokes a tool | Tool name, arguments |
| `tool_result` | Tool returns | Tool output, artifacts |
| `approval_needed` | Destructive action pending | Description, tool call ID, preview |
| `done` | Turn complete | `conversation_id`, final state |

The stream sends keepalive comments (`: keepalive`) every 15 seconds to prevent proxy timeouts.

---

## Conversations

Every interaction is part of a persistent conversation thread. Conversations store full message history, so the agent has context from prior turns.

| Operation | Endpoint | Method |
|---|---|---|
| List conversations | `/api/v1/agent/conversations` | GET |
| Create conversation | `/api/v1/agent/conversations` | POST |
| Get conversation detail | `/api/v1/agent/conversations/{id}` | GET |
| Rename / pin / archive | `/api/v1/agent/conversations/{id}` | PATCH |
| Delete conversation | `/api/v1/agent/conversations/{id}` | DELETE |

Conversations can be filtered by `survey_id` and `archived` status. Titles are auto-generated from the first message but can be overridden via PATCH.

```bash
curl https://api.flashpoint.ai/api/v1/agent/conversations \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "items": [
    {
      "id": "a1b2c3d4-...",
      "title": "Q3 product launch NPS",
      "survey_id": "f8e7d6c5-...",
      "pinned": false,
      "archived": false,
      "created_at": "2026-05-26T09:00:00Z",
      "updated_at": "2026-05-26T09:15:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

## Planning

When you give the agent a broad objective, it follows a structured planning discipline before building anything.

### The planning sequence

1. **Understand the objective.** If the goal is vague, the agent asks 1-3 clarifying questions. It checks: What business decision will this inform? Who is the target audience? What topics should it cover? Any constraints on length or sample size?

2. **Research the topic** (optional). For unfamiliar domains, the agent calls `research_market` or `research_audience` to gather real-world context before planning. This produces grounded, insight-driven questions instead of generic boilerplate.

3. **Present a plan.** The agent calls `plan_survey` to produce a structured blueprint: survey name, objective, audience, blocks (sections), and question counts per block. This emits a plan card for your review — nothing is built yet.

4. **Build on approval.** Once you approve the plan, the agent creates the survey, adds blocks and questions, sets quotas, and runs a validation check (`surveycheck`) before reporting completion.

### When planning is skipped

The agent builds directly without a plan when:
- You provided a complete list of questions
- You are editing an existing survey (add/update/delete individual questions)
- You asked for a single direct action ("add a question about income")
- You explicitly said "just build it" or "skip the plan"

---

## Approval gates

Destructive actions pause for explicit user approval before executing. The agent describes what will happen, and the system renders an approval card in the chat.

**Actions that require approval:**

| Action | What happens on approval |
|---|---|
| Publish survey | Survey goes live — respondents can access it |
| Pause / complete survey | Response collection stops |
| Delete survey | Soft-deleted (recoverable from admin tools) |
| Delete block or questions | Removed from the survey; skip logic may break |
| Send email invitations | Outbound emails sent to the recipient list |
| Resend invitations | Follow-up emails to non-completers |
| Set quotas | Quota configuration replaced |

### Approving or rejecting

```
POST /api/v1/agent/approve
```

```json
{
  "conversation_id": "a1b2c3d4-...",
  "tool_call_id": "toolu_01X...",
  "approved": true,
  "args_override": null
}
```

Set `approved` to `false` to reject. The agent acknowledges the rejection and does not retry.

### Argument overrides

For email-sending actions, you can edit the content before approving. Pass the modified fields in `args_override`:

```json
{
  "conversation_id": "a1b2c3d4-...",
  "tool_call_id": "toolu_01X...",
  "approved": true,
  "args_override": {
    "email_template": {
      "subject": "Updated subject line",
      "body": "Revised email body with {{SURVEY_LINK}}",
      "cta_text": "Start the survey"
    }
  }
}
```

Only whitelisted fields are accepted per tool. Non-whitelisted keys are silently dropped.

| Tool | Overridable fields |
|---|---|
| `send_email_list` | `email_template` |
| `resend_email_list` | `email_template` |
| `send_platform_email` | `subject`, `body_text`, `body_html` |

Approval requests time out after 10 minutes if no decision is submitted.

---

## Workflow examples

### 1. Build a survey from scratch

**You:** "Create a 10-question NPS survey for our Q3 product launch targeting existing customers"

**Agent:**
1. Asks one clarifying question about the product category
2. Calls `research_market` to gather context on product-launch satisfaction benchmarks
3. Calls `plan_survey` with a structured blueprint (screener block, main body, demographics)
4. Waits for your approval of the plan
5. On approval: `create_survey` -> `add_block` x3 -> `add_question` x10 -> `surveycheck`
6. Reports: "Survey created with 10 questions across 3 blocks. Validation passed with no issues."

### 2. Add a screener

**You:** "Add a screener that disqualifies anyone under 18"

**Agent:**
1. Checks the current survey for an existing screener block
2. Calls `add_question` with type `number`, validation `min: 18`, and skip logic to terminate under-18 respondents
3. Runs `surveycheck` to verify the termination logic resolves correctly
4. Reports: "Added age screener as S1. Respondents under 18 are routed to the termination page."

### 3. Translate a survey

**You:** "Translate this survey to Spanish"

**Agent:**
1. Reads the current survey context to identify all translatable content
2. Calls `translate_survey` with target language `es`
3. Reports: "Translation complete. All question text, option labels, and transition messages have been translated to Spanish."

### 4. Run synthetic respondents and analyze

**You:** "Run 30 synthetic respondents and give me the top 3 takeaways"

**Agent:**
1. Redirects to the orchestrator to run synthetic panel respondents through the survey
2. Once responses land, calls `get_all_frequencies` to pull distributions for every question
3. Calls `get_analytics` for the summary metrics
4. Composes a narrative summary with the three most notable findings
5. Reports the takeaways inline in the chat

### 5. Export and email results

**You:** "Export the results as a CSV and email it to team@company.com"

**Agent:**
1. Calls `export_csv` to generate the response data file and upload it to S3
2. Calls `send_platform_email` with the CSV as an attachment (pauses for approval)
3. On approval, sends the email
4. Reports: "CSV exported (847 responses, 42 columns). Email sent to team@company.com."

### 6. Analyze open-ended responses

**You:** "What do the open-ended responses to Q5 say?"

**Agent:**
1. Calls `get_frequencies` for Q5 to see the raw text responses
2. Reads through the responses and identifies themes
3. Composes a summary with theme counts and representative quotes
4. Reports: "142 responses to Q5. Top themes: ease of use (38%), pricing concerns (24%), feature requests (18%). Key quote: ..."

---

## Collaboration

The agent supports inline comments on survey questions for team review workflows.

| Tool | Description |
|---|---|
| `add_comment` | Attach a note to a specific question |
| `list_comments` | See all comments on the current survey |
| `resolve_comment` | Mark a comment as addressed |

**Example:**

> "Add a note on Q3: the wording is leading — needs to be more neutral"

The agent attaches the comment to Q3. Team members see it in the survey builder and can resolve it after making edits.

---

## Research

The agent can conduct web research before building a survey, producing questions grounded in real market data rather than generic boilerplate.

| Tool | Purpose |
|---|---|
| `research_market` | Industry trends, competitive landscape, category dynamics |
| `research_audience` | Demographics, behaviors, preferences for a target group |

**Example:**

> "Research EV ownership trends in the US, then build a survey exploring purchase drivers"

The agent gathers current data on EV adoption rates, top-selling models, and buyer demographics, then uses those findings to inform specific, relevant questions.

---

## Redirects

When you ask for something outside the surveys domain, the agent hands the request off to the orchestrator — the parent system that routes between Flashpoint.AI products.

**Redirected requests include:**
- Creating or managing synthetic persona panels
- Running a panel through a survey
- Generating slide decks or presentations
- Listing or inspecting existing panels

The agent calls `redirect_to_orchestrator` with your original request, and the orchestrator selects the appropriate tool. The result appears in the same conversation.

---

## Tool listing (debug)

To see all registered agent tools and their descriptions:

```bash
curl https://api.flashpoint.ai/api/v1/agent/tools \
  -H "Authorization: Bearer $TOKEN"
```

Returns an array of tool objects with `name`, `category`, `description`, `read_only`, and `destructive` flags.


---

# Authentication

Flashpoint.AI has no API keys. Every request carries a short-lived bearer JWT, and the JWT shape depends on which surface you're calling and who you are.

| Surface | Caller | Auth mechanism |
|---|---|---|
| Chat UI ([app.flashpoint.ai](https://app.flashpoint.ai)) | A human researcher | [Auth0 OAuth → Flashpoint.AI RS256 JWT](#chat-ui-humans-via-auth0) |
| MCP server (`api.flashpoint.ai`) | A human via Claude Desktop / Cursor / etc. | [OAuth 2.1 redirect to Auth0 → mcp-issued user JWT](#mcp-humans-oauth-21-via-claude-desktop) |
| MCP server (`api.flashpoint.ai`) | An autonomous agent | [Wallet JWT — EIP-191 signature on a nonce](#mcp-wallet-jwt-autonomous-agents) |

All bearers go in a standard `Authorization` header:

```
Authorization: Bearer <token>
```

No cookies, no signed requests, no session state on the server.

## Chat UI (humans via Auth0)

The chat UI signs you in through Auth0. The browser handles the redirect dance; you don't write code for this. Auth0 issues an `id_token` which `io` exchanges for a Flashpoint.AI user JWT — RS256, 180-day expiry, payload `{id, kind: "user", expires}`. The JWT goes into localStorage and rides on every WebSocket and REST call from the UI.

You won't typically interact with this token directly. If you're building a custom integration that needs to act as a Flashpoint.AI user (rather than an autonomous agent), use **MCP via Claude Desktop** instead — it's faster to set up and gives you the same identity binding.

## MCP humans (OAuth 2.1 via Claude Desktop)

Claude Desktop and other MCP clients discover and complete a standard OAuth 2.1 flow against the Flashpoint.AI MCP server.

### The flow

1. Client calls `POST /mcp` with no bearer → server returns `401` + a `WWW-Authenticate: Bearer resource_metadata=…` header.
2. Client fetches the [RFC 9728 protected-resource metadata](https://www.rfc-editor.org/rfc/rfc9728) at `/.well-known/oauth-protected-resource` and the [RFC 8414 authorization-server metadata](https://www.rfc-editor.org/rfc/rfc8414) at `/.well-known/oauth-authorization-server`.
3. Client posts a [Dynamic Client Registration (RFC 7591)](https://www.rfc-editor.org/rfc/rfc7591) request to `/oauth/register`, gets back a `client_id`.
4. Client opens the browser to `/oauth/authorize?…&code_challenge=…&code_challenge_method=S256` with its registered redirect URI (loopback for CLI clients like Claude Code, a hosted `https://claude.ai/…` or `https://chatgpt.com/…` callback for Desktop / web / ChatGPT). mcp-server 302s to Auth0.
5. You log in with Auth0 (the same account you'd use in the chat UI). Auth0 302s back to mcp-server's `/oauth/callback`.
6. mcp-server renders an HTML **team picker** listing every team you belong to. You click one.
7. mcp-server mints an HS256 JWT bound to `(user_id, team_id)` with a 24-hour expiry, 302s back to the client's loopback callback with a single-use authorization code.
8. Client posts `/oauth/token` with the code + the PKCE verifier; gets back the JWT as `access_token`.

After that, the client uses the JWT on every `/mcp` request. To switch teams, re-run the connection — the picker shows again.

### What you do

Per-client setup instructions (Claude Desktop, Claude.ai web, Claude Code CLI, ChatGPT custom connector) live in [Connect from your AI assistant](/connect-mcp). For all of them the OAuth dance is handled automatically — you just paste the server URL and sign in. See [Quickstart](/quickstart) for the full first-call walkthrough.

### Token shape

The access token is opaque from the client's perspective. For the curious:

```json
{
  "iss": "flashpoint-mcp",
  "kind": "user",
  "user_id": "<uuid>",
  "team_id": "<uuid>",
  "iat": 1779700000,
  "exp": 1779786400
}
```

24-hour TTL. No refresh token — re-OAuth when it expires.

## MCP wallet JWT (autonomous agents)

If you're an autonomous agent without a human in the loop, you authenticate by signing an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) message with your wallet's private key. mcp-server provisions a Flashpoint.AI user + team for your wallet on first contact (idempotent on the address).

### The flow

1. `POST /auth/wallet/challenge` → server returns `{nonce, message_to_sign, expires_at}`. The `message_to_sign` is namespaced (`flashpoint-mcp-auth:<nonce>`) so a signature for us is not reusable elsewhere.
2. Sign the message with `personal_sign` (EIP-191).
3. `POST /auth/wallet/token` with `{address, nonce, signature}` → server recovers the signer, checks it matches `address`, consumes the nonce, provisions `users(kind='agent')` + `teams(kind='agent')` if needed, and returns a 1-hour wallet JWT.
4. Use the JWT on every `/mcp` request: `Authorization: Bearer <token>`.

### Token shape

```json
{
  "iss": "flashpoint-mcp",
  "kind": "wallet",
  "address": "0x…",
  "user_id": "<uuid>",
  "team_id": "<uuid>",
  "iat": 1779700000,
  "exp": 1779703600
}
```

1-hour TTL. Get a new nonce and re-sign when it expires.

### Per-call payment ([x402](https://www.x402.org))

Wallet agents pay per tool call in USDC on Base. When you hit a paid tool without an `X-PAYMENT` header, the server returns `402` with the payment terms — `payTo` address, asset, amount, network — encoded for the [x402 protocol](https://www.x402.org). Pay through the [x402 facilitator](https://github.com/coinbase/x402), retry with the `X-PAYMENT` header, and the server settles on-chain after a successful tool result.

Two important guarantees:

- **Wallet-binding.** The on-chain `payer` address must match the wallet address in your JWT. Paying with one wallet under another wallet's bearer is rejected at the verify step (`402`).
- **No charge on failure.** If the worker returns an error, we skip settlement — your signature is not redeemed.

Human bearers (Auth0 or OAuth) are not gated by x402 — your subscription covers per-call usage.

## Errors

Every auth failure returns one of:

| Status | When |
|---|---|
| `401` | Bearer missing, malformed, expired, or signature invalid |
| `403` | Account suspended (rare) |
| `402` | Wallet agent hit a paid tool without payment (see above) |

See [Errors](/errors) for the canonical error envelope.


---

# Webhooks

Flashpoint.AI receives webhooks from panel providers (Prolific, Dynata) to update fielding status in real time, and from Stripe for billing events. When a respondent completes a study, a panel reaches its target, or a subscription state changes, the provider notifies Flashpoint.AI and the platform updates its records automatically.

These endpoints are inbound only — Flashpoint.AI is the **receiver**, not the sender. You do not subscribe to them; they are documented here for transparency about how the platform reacts to upstream events.

## Prolific webhooks

```
POST /api/v1/webhooks/prolific
```

Prolific sends webhooks for respondent-level and study-level events.

### Events

| Event | Trigger | What Flashpoint.AI does |
|---|---|---|
| `submission.completed` | Respondent finished the study | Logs completion, links response to the panel integration |
| `submission.returned` | Respondent returned their slot | Logs the return so the slot can be re-filled |
| `study.completed` | Study reached target completions | Sets the panel integration status to `completed`, emits a `PANEL_COMPLETED` event |

### Signature verification

Prolific signs every webhook with HMAC-SHA256. The signature is sent in the `X-Prolific-Signature` header.

Flashpoint.AI verifies the signature by computing the HMAC of the raw request body using the shared secret and comparing it to the header value. Requests with missing or invalid signatures are rejected with `401`.

### Payload shape

```json
{
  "event_type": "submission.completed",
  "data": {
    "participant_id": "60a1b2c3d4e5f6...",
    "study_id": "61a2b3c4d5e6f7..."
  }
}
```

## Dynata webhooks

```
POST /api/v1/webhooks/dynata
```

Dynata sends webhooks for pricing changes, line-item state transitions, and project-level state changes.

### Events

| Event | Trigger | What Flashpoint.AI does |
|---|---|---|
| `REPRICING` | Dynata raised the per-complete cost mid-fielding | **Auto-pauses** the integration to protect the budget. Appends the repricing event to the audit log. Emits `PANEL_PAUSED`. |
| `LINE_ITEM_STATE_CHANGE` | A line item transitioned state (e.g. LAUNCHED, PAUSED) | Records the new state in `provider_config` for audit trail. No status change on the Flashpoint.AI side. |
| `PROJECT_STATE_CHANGE` | Project transitioned state (e.g. COMPLETED, CLOSED) | Records the new state. If terminal (`COMPLETED` or `CLOSED`), marks the integration as `completed` and emits `PANEL_COMPLETED`. |

### Repricing auto-pause

Repricing is a financial safety event. When Dynata raises the cost-per-complete beyond what the customer originally approved, Flashpoint.AI automatically pauses the integration via the Dynata API. The customer must explicitly re-approve the new rate before fielding resumes. The old and new prices are recorded in the integration's `provider_config.repricing_events` array.

### Signature verification

Dynata signs webhooks with the same algorithm as Prolific: HMAC-SHA256 over the raw body, sent in the `X-Dynata-Signature` header. Missing or invalid signatures are rejected with `401`.

### Payload shape

```json
{
  "type": "REPRICING",
  "eventId": "evt_abc123",
  "projectId": "proj_xyz789",
  "lineItemId": "li_456",
  "oldPrice": { "cpi": 4.50 },
  "newPrice": { "cpi": 6.25 },
  "reason": "Feasibility adjustment"
}
```

## Stripe webhooks (billing)

```
POST /webhooks/stripe
```

Stripe drives subscription state and per-action payments. Every billing-related event is delivered here; the handler is idempotent (events are deduplicated by `event.id` server-side) and resilient to retries.

### Events

| Event | Trigger | What Flashpoint.AI does |
|---|---|---|
| `customer.subscription.created` | New seat-tier subscription | Mirrors purchased seats + Stripe IDs into the team's plan |
| `customer.subscription.updated` | Seat count, plan, or status change | Re-mirrors the subscription state |
| `customer.subscription.deleted` | Subscription cancelled | Clears the team's subscription state and revokes any active licenses beyond the free-seat cap (newest-first, so the longest-tenured holders keep access) |
| `checkout.session.completed` | Hosted Checkout session paid | Flips the matching payment row to `succeeded` and publishes a fan-out event so downstream services (panel launches, etc.) react |
| `checkout.session.expired` | Hosted Checkout session lapsed (24h unpaid) | Flips the payment row to `expired` and rolls back any pending action it was funding |
| `payment_intent.succeeded` | Direct PaymentIntent confirmed | Marks the intent paid and dispatches the success callback to the originating service |
| `payment_intent.payment_failed` | Direct PaymentIntent declined | Marks the intent failed and dispatches the failure callback |
| `charge.refunded` | Refund settled on a charge | Appends an audit event to the corresponding payment intent |

Any other event types Stripe delivers are recorded and acknowledged with `200` but produce no state change.

### Signature verification

Stripe signs every webhook. The signature is sent in the `stripe-signature` header and verified server-side using Stripe's standard `constructEvent` against the configured webhook secret. Missing or invalid signatures are rejected with `400` and Stripe retries with backoff.

### Idempotency

Every received event is recorded in a `stripe_events` table on first delivery. Re-deliveries (Stripe retries, multi-region duplication) collapse to `200 {"received": true, "deduped": true}` without re-running any side effects.

### Response shape

| Status | Body | Meaning |
|---|---|---|
| `200` | `{"received": true}` | Event accepted and dispatched |
| `200` | `{"received": true, "deduped": true}` | Already processed; no-op |
| `400` | `{"error": "missing stripe-signature header"}` or `"signature verification failed"` | Stripe will retry |
| `500` | `{"error": "handler error"}` | Handler raised; Stripe will retry |

## Verifying signatures

Both panel providers use the same HMAC-SHA256 algorithm. (Stripe uses its own scheme — see the Stripe section above.) Here is a reference implementation for the panel webhooks:

```python
import hashlib
import hmac

def verify_webhook(body: bytes, signature: str, secret: str) -> bool:
    """Verify an HMAC-SHA256 webhook signature.

    Args:
        body: Raw request body bytes.
        signature: Hex-encoded signature from the header.
        secret: Shared secret configured for the provider.

    Returns:
        True if the signature is valid.
    """
    expected = hmac.new(
        secret.encode("utf-8"),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

Use `hmac.compare_digest` (constant-time comparison) to prevent timing attacks.

## Response behavior

Both endpoints return `200 {"status": "ok"}` on success. Providers retry on non-2xx responses, so returning 200 even for internally unroutable events (e.g. unknown `project_id`) prevents retry storms. Actual processing failures are captured in the audit log for investigation.


---

# GDPR & privacy

Flashpoint.AI provides built-in GDPR and CCPA compliance tools. Three operations cover the core data subject rights: lookup, export (Right to Access), and erasure (Right to Erasure).

All operations are team-scoped — a team can only manage data subjects within their own data. Every operation is recorded in the audit trail with the actor, timestamp, and outcome.

## Subject lookup

Check whether a data subject exists in your team's data before initiating an export or erasure request.

```
GET /api/v1/gdpr/subjects/lookup?email=respondent@example.com
```

```bash
curl "https://api.flashpoint.ai/api/v1/gdpr/subjects/lookup?email=respondent@example.com" \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "found": true,
  "response_count": 3,
  "distribution_count": 5,
  "email_hash": "a1b2c3d4e5f6..."
}
```

| Field | Description |
|---|---|
| `found` | `true` if any responses or distribution records match |
| `response_count` | Number of survey responses linked to this email |
| `distribution_count` | Number of email distribution records for this address |
| `email_hash` | One-way hash of the email, used as the de-identified reference |

The lookup does not expose full PII — only counts and the hash.

## Right to Access (data export)

Export all data held for a data subject. Returns every survey response and distribution record associated with the given email address. GDPR Article 15 requires this to be fulfilled within 30 days of request.

```
POST /api/v1/gdpr/subjects/export
```

```bash
curl -X POST https://api.flashpoint.ai/api/v1/gdpr/subjects/export \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "respondent@example.com"}'
```

```json
{
  "email_hash": "a1b2c3d4e5f6...",
  "surveys_participated": 2,
  "responses": [
    {
      "response_id": "r1a2b3c4-...",
      "survey_id": "s5d6e7f8-...",
      "status": "COMPLETE",
      "data": { "Q1": "3", "Q2": ["1", "4"], "Q3": "Great experience" },
      "country": "US",
      "started_at": "2026-05-20T14:00:00Z",
      "completed_at": "2026-05-20T14:08:32Z",
      "created_at": "2026-05-20T14:00:00Z"
    }
  ],
  "distribution_records": [
    {
      "email_list_id": "el1a2b3c-...",
      "survey_id": "s5d6e7f8-...",
      "status": "completed",
      "sent_at": "2026-05-19T10:00:00Z",
      "started_at": "2026-05-20T14:00:00Z",
      "completed_at": "2026-05-20T14:08:32Z"
    }
  ],
  "exported_at": "2026-05-26T12:00:00Z"
}
```

The export is audit-logged automatically — the requesting user, timestamp, and response count are recorded.

## Right to Erasure (anonymization)

Anonymize all PII for a data subject. This operation is **irreversible**. GDPR Article 17 requires completion within 30 days.

```
POST /api/v1/gdpr/subjects/delete
```

```bash
curl -X POST https://api.flashpoint.ai/api/v1/gdpr/subjects/delete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "respondent@example.com", "reason": "Data subject erasure request via support ticket #4821"}'
```

```json
{
  "email_hash": "a1b2c3d4e5f6...",
  "responses_anonymized": 3,
  "distribution_records_anonymized": 5,
  "completed_at": "2026-05-26T12:01:00Z"
}
```

| Field | Description |
|---|---|
| `responses_anonymized` | Number of survey responses where PII was cleared |
| `distribution_records_anonymized` | Number of email records where the address was replaced with a hash |
| `completed_at` | Timestamp of completion |

## How anonymization works

Erasure does not delete response data outright. Survey answers are retained for aggregate analytics (per GDPR Recital 26 — anonymous data is not personal data). Instead, Flashpoint.AI removes every field that could identify the individual:

**On survey responses:**

| Field | Before | After |
|---|---|---|
| `ip_hash` | `a1b2c3...` | `null` |
| `country` | `US` | `null` |
| `region` | `California` | `null` |
| `city` | `San Francisco` | `null` |
| `timezone` | `America/Los_Angeles` | `null` |
| `email_token` | `tok_xyz...` | `null` |
| `respondent_metadata` | `{"browser": "Chrome", ...}` | `{}` |
| `panel_data` | `{"participant_id": "..."}` | `{}` |
| Answer data (`data`) | Preserved | Preserved |
| Status | Preserved | Preserved |

**On distribution records:**

| Field | Before | After |
|---|---|---|
| `email` | `respondent@example.com` | `anonymized:a1b2c3d4...` |
| `token` | `tok_full_token_value` | `revoked:tok_full` |

The email is replaced with an `anonymized:` prefix plus a truncated hash. The distribution token is revoked so the survey link can no longer be used.

## Retention

- **Active surveys** retain anonymized response data indefinitely for aggregate analytics.
- **Soft-deleted surveys** preserve the audit trail (who created, published, deleted) but anonymization removes all respondent PII regardless of survey status.
- **Audit log entries** for GDPR operations themselves are retained permanently as compliance evidence. They record the actor, action, and outcome but never store the original email — only the hash.


---

# Data Processing Agreement

**Last Updated:** February 23, 2026

This Data Processing Addendum ("DPA") is incorporated into and forms part of the Terms of Service or other agreement (the "Principal Agreement") between Natural Language Labs Inc. d/b/a Flashpoint.AI ("Data Processor" or "Flashpoint.AI") and the entity agreeing to these terms ("Data Controller" or "Customer"), collectively referred to as the "Parties."

This DPA applies automatically to all Customers whose use of the Services involves the processing of Personal Data subject to Applicable Data Protection Laws. By creating an account or using the Services, Customer agrees to this DPA. In the event of any conflict between this DPA and the Principal Agreement with respect to data protection matters, this DPA shall prevail.

> **Enterprise customers** may request a custom data processing agreement that supersedes this DPA. To discuss custom terms, please contact us at [legal@flashpoint.ai](mailto:legal@flashpoint.ai).

---

## 1. Definitions

In this DPA, the following terms have the meanings set out below:

- **"Applicable Data Protection Laws"** means the GDPR (Regulation (EU) 2016/679), the UK GDPR, and any other applicable data protection legislation.
- **"Personal Data"** means any information relating to an identified or identifiable natural person processed by the Processor on behalf of the Controller under the Principal Agreement.
- **"Processing"** means any operation performed on Personal Data, including collection, recording, storage, adaptation, retrieval, consultation, use, disclosure, erasure, or destruction.
- **"Data Subject"** means the identified or identifiable natural person to whom the Personal Data relates.
- **"Sub-processor"** means any third party appointed by the Processor to process Personal Data on behalf of the Controller.
- **"Data Breach"** means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, Personal Data.

---

## 2. Scope and Purpose of Processing

2.1. The Processor shall process Personal Data only on documented instructions from the Controller, including with respect to transfers of Personal Data to a third country, unless required to do so by applicable law.

2.2. The subject matter, nature, purpose, duration, types of Personal Data, and categories of Data Subjects are described in Annex 1 to this DPA.

---

## 3. Obligations of the Processor

The Processor shall:

- Process Personal Data only on documented instructions from the Controller, unless required by applicable law.
- Ensure that persons authorized to process Personal Data have committed to confidentiality or are under an appropriate statutory obligation of confidentiality.
- Implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, pseudonymization, and regular security testing.
- Not engage another processor (sub-processor) without prior specific or general written authorization of the Controller.
- Assist the Controller in responding to requests from Data Subjects exercising their rights under Applicable Data Protection Laws.
- Assist the Controller in ensuring compliance with obligations relating to security, breach notification, data protection impact assessments, and prior consultation with supervisory authorities.
- At the choice of the Controller, delete or return all Personal Data after the end of the provision of services, and delete existing copies unless applicable law requires storage.
- Make available to the Controller all information necessary to demonstrate compliance with obligations and allow for and contribute to audits conducted by the Controller or an auditor mandated by the Controller.

---

## 4. Sub-processors

4.1. The Controller provides general written authorization for the Processor to engage sub-processors. The current list of approved sub-processors is set out in Annex 2 and is also available at [flashpoint.ai/subprocessors](https://flashpoint.ai/subprocessors).

4.2. The Processor shall inform the Controller of any intended changes to its sub-processors, giving the Controller the opportunity to object to such changes within 30 days. If the Controller objects and the Processor cannot reasonably accommodate the objection, either Party may terminate the affected services.

4.3. The Processor shall impose data protection obligations on any sub-processor by way of a written contract that provides at least the same level of protection as this DPA.

---

## 5. International Transfers

5.1. The Processor shall not transfer Personal Data outside the EU/EEA/UK unless appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by the European Commission, or other lawful transfer mechanisms.

5.2. Where SCCs are required, they are incorporated into this DPA by reference and shall be deemed executed by the Parties.

---

## 6. Data Breach Notification

6.1. The Processor shall notify the Controller without undue delay, and in any event within 48 hours, after becoming aware of a Data Breach affecting Personal Data processed under this DPA.

6.2. The notification shall include the nature of the breach, categories and approximate number of Data Subjects affected, likely consequences, and measures taken or proposed to address the breach.

6.3. The Processor shall cooperate with the Controller and take reasonable commercial steps to assist in the investigation, mitigation, and remediation of the Data Breach.

---

## 7. Audit Rights

7.1. The Processor shall make available to the Controller all information necessary to demonstrate compliance with this DPA and Applicable Data Protection Laws.

7.2. The Controller or its mandated auditor may conduct audits, including inspections, upon reasonable notice (not less than 30 days). Audits shall be conducted during normal business hours and shall not unreasonably interfere with the Processor's operations.

7.3. The Processor may satisfy audit requests by providing relevant certifications or audit reports (such as SOC 2 reports) where available.

---

## 8. Data Subject Rights

8.1. The Processor shall promptly assist the Controller in responding to requests from Data Subjects to exercise their rights under Applicable Data Protection Laws, including rights of access, rectification, erasure, restriction, portability, and objection.

8.2. If the Processor receives a request directly from a Data Subject, it shall promptly forward the request to the Controller and shall not respond to the Data Subject directly without the Controller's instructions, unless legally required to do so.

---

## 9. Data Protection Impact Assessments

The Processor shall provide reasonable assistance to the Controller with any data protection impact assessments and prior consultations with supervisory authorities that the Controller is required to carry out under Applicable Data Protection Laws.

---

## 10. Term and Termination

10.1. This DPA shall remain in effect for the duration of the Principal Agreement and shall automatically terminate upon termination or expiration of the Principal Agreement.

10.2. Upon termination, the Processor shall, at the Controller's election, return or securely delete all Personal Data within 30 days, unless retention is required by applicable law. The Processor shall certify deletion in writing upon request.

---

## 11. Liability

The liability of each Party under this DPA shall be subject to the limitations and exclusions of liability set out in the Principal Agreement.

---

## 12. Governing Law

This DPA shall be governed by and construed in accordance with the laws that govern the Principal Agreement, except where Applicable Data Protection Laws require otherwise.

---

## Annex 1: Details of Processing

| Field | Details |
|---|---|
| **Subject Matter of Processing** | Provision of AI-powered market research, survey, and behavioral validation services. |
| **Duration of Processing** | For the duration of the Principal Agreement plus any retention period required by law. |
| **Nature and Purpose of Processing** | Collection, storage, analysis, and reporting of survey responses, behavioral data, and related analytics for market research purposes. |
| **Types of Personal Data** | Name, email address, IP address, device identifiers, survey responses, behavioral and interaction data, demographic information, and any other data provided by or about Data Subjects through the Platform. |
| **Categories of Data Subjects** | Survey respondents, research panel participants, end users of the Platform, and Customer personnel. |

---

## Annex 2: Approved Sub-processors

The following sub-processors are authorized to process Personal Data under this DPA:

| Sub-processor | Purpose | Data Processed | Location |
|---|---|---|---|
| Amazon Web Services (AWS) | Cloud infrastructure and hosting | All platform data | United States |
| OpenAI | AI model inference and processing | Survey and research data (anonymized where possible) | United States |
| Anthropic | AI model inference and processing | Survey and research data (anonymized where possible) | United States |
| Stripe | Payment processing | Payment and billing data | United States |
| Auth0 (Okta) | Authentication and identity management | User credentials and profile data | United States |
| Twilio | Communication services (SMS, email) | Contact information and message content | United States |
| Slack | Internal team communication | Incidental personal data in support workflows | United States |
| Sentry | Error tracking and monitoring | Technical data, IP addresses, error context | United States |
| Microsoft | AI research assistant integration (Graph API) | Email data, calendar data, user profile information | United States |

An up-to-date list of sub-processors is maintained at [flashpoint.ai/subprocessors](https://flashpoint.ai/subprocessors). The Controller will be notified of any changes in accordance with Section 4 of this DPA.


---

# Errors

Every error response uses the same shape:

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Try again in 12s.",
    "trace_id": "01HXYZ..."
  }
}
```

Always log `trace_id` — support can resolve issues an order of magnitude faster when you include it. Errors emitted by the surveys service use the field name `correlation_id` instead of `trace_id`; the two are interchangeable for support lookups.

## Status codes

| Status | Meaning                                                     |
|--------|-------------------------------------------------------------|
| `400`  | Malformed request — missing or invalid parameter            |
| `401`  | Missing, invalid, or revoked API key                        |
| `403`  | Authenticated, but the key lacks the required scope         |
| `404`  | Resource does not exist or is not visible to this workspace |
| `409`  | State conflict — the resource changed under you             |
| `422`  | Validation failed on a syntactically valid request          |
| `429`  | Rate-limited — see `Retry-After` header                     |
| `5xx`  | Server-side. Safe to retry with backoff.                    |

## Error codes

| Code                 | When                                            |
|----------------------|-------------------------------------------------|
| `invalid_request`    | The body or query string failed parsing         |
| `invalid_api_key`    | Key not recognized                              |
| `not_found`          | Resource ID does not exist                      |
| `rate_limited`       | Quota exhausted for this minute or day          |
| `email_weekly_cap_exceeded` | A send would exceed the team's weekly invitation budget (`429`). Nothing was sent; `details` has `used`, `attempted`, `remaining`, `resets_at`. See [Email distribution › Sending limits](/distribute-email#sending-limits) |
| `email_budget_unavailable` | The send budget could not be checked (`503`). Retry in a minute |
| `invalid_sending_status` | The email list has already been sent or is sending (`409`) |
| `internal_error`     | Server-side fault — opens an internal incident  |

## Retry policy

Retry `429` and `5xx` with exponential backoff and full jitter. Cap retries at 5 attempts. Do not retry `4xx` other than `429` — the request will fail again.


---

# API Reference

The Flashpoint.AI MCP server exposes five direct tools plus a `chat` tool that hands off to the full orchestrator. Every tool runs through the same identity model — see [Authentication](/authentication) — and respects per-team scoping.

**Endpoint:** `https://api.flashpoint.ai/mcp` (production) · `https://mcp-staging.flashpoint.ai/mcp` (staging)

**Transport:** MCP Streamable HTTP over POST. Each request is a JSON-RPC envelope:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": { "name": "<tool-name>", "arguments": { … } }
}
```

You don't normally hand-craft these — MCP clients (Claude Desktop, Claude Code, ChatGPT, Cursor, etc.) handle the protocol for you.

## When to use which tool

| Goal | Tool | Brain |
|---|---|---|
| Anything about a survey: plan, design, quotas, translate, QA, publish, recruit paid respondents, distribute, analyze, export | `tool_survey` | Wraps the surveys agent — multi-turn LLM with ~150 internal tools and confirm gates. Every one of them is listed in the [MCP capability reference](/mcp-capabilities) |
| Synthetic respondents: build a persona panel, run it through a survey, or recruit paid respondents | `panel` | Direct dispatch (`recruit` delegates to the surveys agent) |
| Population stats for a place | `demographics` | Direct dispatch — single worker call |
| Native `.pptx` with editable charts | `presentation` | Direct dispatch |
| Settle an x402 panel payment (wallet agents only) | `payment_confirmation` | Direct |
| Multi-domain plan in one shot, or orchestrator-only capabilities (ad experiments, research scoping, team files, maps, asking a panel a question) | `chat` | Full orchestrator — picks tools, runs them, narrates |

Direct-dispatch tools are faster (one worker, no second LLM planning loop). Send **all survey work to `tool_survey`**, not `chat` — the surveys agent already plans and runs multi-step survey flows itself, and routing it through `chat` adds a redundant LLM hop and a longer handshake.

The older tool names `surveys_agent`, `create_panel`, and `get_demographics` are still registered as deprecated aliases of `tool_survey`, `panel(action="create")`, and `demographics`.

---

## `tool_survey`

The single entry point for anything survey-related. Hand it a natural-language brief; the surveys agent runs its own multi-turn loop (planning plus a large internal toolset) and takes the next steps itself. You do not chain individual operations.

### What it covers

| Area | Capabilities |
|---|---|
| Plan & research | Clarify the objective, research the market / audience / competitors, propose a blueprint before building; start from a template or save a survey as one |
| Design | 20+ question types (single, multi, grids, ranking, MaxDiff, conjoint / CBC, image compare, spatial allocation, thermometer, sliders, open ends, contact form, AI-moderated interview); blocks with rotation / randomization, answer lists, skip and display logic, piping, loops, URL variables, redirect URLs, derived values, exclusive options, data validation |
| Quotas & sample sources | Quota cells, least-fill, quota sheets, progress / reconcile / export; bring-your-own sample sources with per-vendor links and redirects; first-party and custom panels |
| Languages | Add survey languages, machine-translate, review or set individual translations |
| Validation & QA | `surveycheck` logic prover, publish readiness, DSL validation, QA rounds with findings, walk a respondent path, field report, client review link |
| Launch & lifecycle | Publish, pause, resume, complete, clone, transfer; version history, compare, restore, undo |
| Paid recruitment | Prolific, Dynata, Cint: browse filters and markets, get a quote, then on confirmation a secure checkout link; panel status / pause / resume after launch |
| Distribution | Email lists and templates, invitations, reminders, send to a panel, send reports |
| Data quality | Speeders, straightliners, quality summary, exclude responses, generate test data |
| Analysis & exports | Frequencies, crosstabs with stat tests, NPS, open-end themes, AI summaries and key takeaways; conjoint analytics (market simulator, willingness-to-pay, sensitivity, segments, product optimizer, share link); CSV / XLSX / DOCX / PDF exports; results dashboard |
| Collaboration | Comments on questions, resolve threads |

Interactive cards (plan, approval, results dashboard, conjoint simulator, checkout) render in the Flashpoint.AI web app, not in your assistant. The text reply carries the substance, and every MCP conversation is also visible at [app.flashpoint.ai](https://app.flashpoint.ai) afterwards.

### Confirm pattern

Money and destructive actions (publish, delete, send emails, paid recruitment) are never performed on the first ask. The agent replies asking you to confirm; your assistant relays that, and you call again on the **same** `conversation_id` with the confirmation (e.g. "confirm"). Nothing is charged without that explicit second step. For paid recruitment the confirmation returns a hosted Stripe Checkout link you open in a browser.

### Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `brief` | string | yes | What you want done, in natural language — a build spec, an edit, a recruitment request, an analysis ask, an export, a confirmation |
| `survey_id` | string | no | Pass to act on an existing survey; omit to create a new one |
| `conversation_id` | string | no | Pass the value returned by a previous call to continue the same thread. Required to keep context across build → recruit → analyze and to satisfy a confirm step. Omit on the first call and the server mints one |

### Returns

The agent's result blob (typically includes the relevant `survey_id`), with the `conversation_id` echoed back so follow-up calls can thread:

```json
{
  "conversation_id": "<uuid>",
  "survey_id": "<uuid>",
  "...": "..."
}
```

The call may take 60–600s. Clients that send a `progressToken` receive progress notifications for each agent step while it runs.

See [Surveys](/surveys) for the broader survey model.

---

## `panel`

Manage respondent samples — synthetic personas and paid recruits. Routing is by `action`:

| `action` | What it does | Required |
|---|---|---|
| `create` | Build a synthetic panel of AI-generated personas (max 200). Returns a `panel_id` | `name`, `num_respondents`, `research_objective` |
| `create_and_run` | Build a fresh synthetic panel and run it through a survey in one call. Progress streams via MCP progress notifications; long runs (~45 min) survive idle timeouts | `name`, `num_respondents`, `research_objective`, `survey_id` |
| `run` | Not supported on the direct path — an existing panel's personas live in the orchestrator's artifact store. Use `create_and_run`, or ask `chat` to run the panel by id | — |
| `recruit` | Real paid respondents from Prolific / Dynata / Cint. Delegates to the surveys agent's quote → confirm → checkout flow | `survey_id` (for a quote) or `request` (free-text catalog browse) |

### Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `action` | string | yes | `create`, `create_and_run`, `run`, or `recruit` |
| `name` | string | create | Panel name |
| `num_respondents` | integer | create | Persona count, 1–200 |
| `research_objective` | string | create | What the panel is for — shapes the personas |
| `context` | string | no | Extra grounding, e.g. real distributions from `demographics` |
| `audience` | object | no | Structured audience targeting |
| `survey_id` | string | create_and_run, recruit | Survey to run or to quote recruitment for |
| `provider` | string | no | `prolific`, `dynata`, or `cint` |
| `request` | string | no | Free-text catalog question for `recruit`, e.g. "what Prolific filters are available?" |
| `conversation_id` | string | no | Thread follow-up `recruit` calls (quote → confirm) |

### Returns

A worker `ToolResult` dict — `status`, `result`, `error`, and timing. `create_and_run` returns both the `panel_id` and the run result.

---

## `demographics`

Population, age, race, gender, education, and income distributions with AI-powered insights. US locations are sourced from the US Census Bureau; international locations come from a curated city/country database.

### Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `location` | string | yes | A US zip code, city name, country, or any human-readable place |
| `question` | string | no | Sharpen the response — e.g. "focus on adults 25–44 with a college degree" |
| `audience` | string | no | Override the implied audience — e.g. "small-business owners" |

### Returns

A worker `ToolResult` dict — `status`, `result`, `error`, and timing.

---

## `presentation`

Generate a native PowerPoint (`.pptx`) deck with editable charts.

### Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Deck title |
| `data_context` | string | yes | Survey, analysis, or any text-form data the deck should be built from |
| `custom_instructions` | string | no | Tone, brand notes, structure overrides |
| `max_slides` | integer | no — default `12` | Clamped to 2–30 |

### Returns

A worker `ToolResult` dict. When S3 is configured the deck is uploaded and a `download_url` is returned; otherwise the raw `.pptx` is base64-encoded as `pptx_base64`.

---

## `payment_confirmation`

Settle an x402 panel payment intent and trigger the panel launch. **Autonomous wallet agents only** — humans complete panel payment through the Stripe Checkout link the surveys agent returns, not through this tool.

Call it after `tool_survey` (or `chat`) returns an `x402_payment_required` envelope, passing the envelope's `intent_id`. The x402 middleware paywalls this tool by the intent's exact amount: the first call returns a `402` with the on-chain payment requirements (EIP-3009 on Base USDC); sign the authorization, retry with the `X-PAYMENT` header, and the facilitator settles the transfer. The panel starts launching once the settle succeeds.

| Name | Type | Required | Description |
|---|---|---|---|
| `intent_id` | string | yes | The `intent_id` from the `x402_payment_required` envelope |

---

## `chat`

Send a message to Flashpoint.AI's server-side orchestrator and wait for the assistant's reply. The orchestrator decides what to do and returns when the turn is complete.

**Use when** you want a multi-domain flow planned in one shot (e.g. demographics + a synthetic panel + a presentation), or for capabilities that have no direct tool yet:

- **Ad and market experiments** on Google, Meta, or LinkedIn Ads: build variants, run synthetic personas through them before spending budget, launch, and analyze campaign results
- **Research scoping**: decide what to research, pick a methodology, draft a Statement of Work
- **Existing synthetic panels**: ask a panel a single question, list the team's panels, run or calibrate a panel by id
- **Team file library**: search and read the team's surveys, results, panels, and documents
- **Maps** of places or regions

Do not route survey work here — use `tool_survey`.

### Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `message` | string | yes | What you want Flashpoint.AI to do, in natural language |
| `conversation_id` | string | no | Pass the value returned by a previous call to continue the same conversation. Omit to start a new thread |

### Returns

```json
{
  "conversation_id": "<uuid>",
  "reply": "<assistant text — the full turn>"
}
```

The call blocks until the orchestrator finishes the turn (timeout 600s).

---

## Pricing (wallet agents)

Humans signed in through OAuth are not charged per call — usage is covered by the Flashpoint.AI subscription. Autonomous wallet agents pay per call in USDC over [x402](https://www.x402.org) on Base; calling without payment returns a `402` with the terms. Defaults: `chat` $0.01, `demographics` $0.05, `tool_survey` $0.50, `presentation` $0.25, `panel` $0.50 (`create`), $0.60 (`create_and_run`), $0.50 (`recruit`). A call whose worker returns an error is not settled.

---

## Discovery endpoints

For programmatic clients that need to spin up the OAuth flow:

| Path | What |
|---|---|
| `GET /.well-known/oauth-protected-resource` | [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728) protected-resource metadata |
| `GET /.well-known/oauth-authorization-server` | [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414) authorization-server metadata |
| `POST /oauth/register` | [RFC 7591](https://www.rfc-editor.org/rfc/rfc7591) dynamic client registration |
| `GET /oauth/authorize` | Standard OAuth 2.1 + PKCE entry point |
| `POST /oauth/token` | Authorization-code exchange |

You shouldn't need to call any of these by hand if you're using a standard MCP client.

## Surveys REST API

Most surveys operations are also available as a REST API directly against the surveys service. See [Surveys › Build](/surveys-build) and the per-area pages ([Lifecycle](/surveys-lifecycle), [Distribute](/surveys-distribute), [Analyze](/surveys-analyze), [Import & export](/surveys-import-export)) for endpoint paths and payloads.
