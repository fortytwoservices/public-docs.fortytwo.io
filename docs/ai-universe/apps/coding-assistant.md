---
description: Connect Claude Code, Codex, VS Code or Cursor to the platform, so your coding assistant gets the app's Wisdom and can check its own releases. Signed in with Azure, with no key in the repository.
icon: plug
---

# Connect your coding assistant

When you work on an app in your own coding tool, your assistant connects to the platform over MCP. On connect, it receives the app's [Wisdom](wisdom.md): Fortytwo's rules, your organisation's, then the app's own. Nothing of that lives in the repository, so it stays current without anyone editing code.

Every app's repository is already set up for this. There is nothing to configure and no key to paste.

## Connect

::::steps
### Sign in to Azure

```bash
az login
```

The connection uses your own Azure sign-in. The [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) is required, and there is no key to use instead.

### Have a role on the app

You need a role on the app's [People](people.md) tab. Your role decides which Wisdom you receive.

### Open the repository in your tool

Claude Code, Codex and Cursor read `.mcp.json`. VS Code reads `.vscode/mcp.json`. Both start the same small local process, `pnpm mcp`, which signs in with your Azure sign-in and forwards each request to the platform with a short-lived token.
::::

To check the connection from a terminal:

```bash
pnpm mcp:check
```

## What your assistant can do

| Tool | Who gets it | What it does |
|-|-|-|
| `skills_list`, `skills_get` | Everyone with a role on the app | List and fetch skills: named sets of steps for a kind of task. |
| `agents_list`, `agents_get` | Everyone with a role on the app | List and fetch specialists, each with its own instructions. |
| `knowledge_search`, `knowledge_add` | Everyone with a role on the app | Search what your organisation and team have written down, and save a lesson for this app. |
| `galaxy_status` | **Can help build it** and **Runs it** | The app's state and the version that is running. |
| `galaxy_releases` | **Can help build it** and **Runs it** | Recent releases, and whether each one went live. |
| `galaxy_deploy_status` | **Can help build it** and **Runs it** | The latest deploy run, and whether the new version is running. |
| `galaxy_logs` | **Can help build it** and **Runs it** | Recent logs, with tokens, passwords and keys hidden. |

The four `galaxy_*` tools answer "did my last release go live, and if not, why?" without opening GitHub or the Azure portal. They only read: nothing here starts a deploy or a rollback, and nothing here calls an AI model.

There is no code generator and no scaffolding command. If a tool offers to run one, it is guessing.

## When it does not connect

The process writes the reason to its error output, so a refusal such as *you hold no role on this app* shows up as an error, not as tools that quietly fail to appear. Almost always it is one of two things:

- you are not signed in: run `az login`
- you have no role on the app: ask someone who **Runs it** to add you on the [People](people.md) tab

:::details[VS Code asks for a client ID]
If you are not signed in, VS Code sees the refusal, assumes the server wants OAuth, and asks whether to *proceed by manually providing a client registration (client ID)*. Answer **no**: no client ID will help. Run `az login`, check your role, then restart the server from **MCP: List Servers** in the Command Palette.
:::

:::details["Dynamic Client Registration rejected"]
Some clients report:

```text
Dynamic Client Registration rejected (HTTP 404): { "message": "Resource not found" }
```

The message names the wrong thing. There is no client to register, on purpose: the platform does not offer that sign-in flow. The cause is the same as above. Sign in with `az login`, and check that you have a role on the app.
:::
