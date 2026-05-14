# n8n-nodes-hiway2llm

[![npm version](https://badge.fury.io/js/n8n-nodes-hiway2llm.svg)](https://badge.fury.io/js/n8n-nodes-hiway2llm)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**HiWay2LLM** is a smart LLM router that lets you use Claude, GPT-4o, Gemini, Mistral and more — with your own API keys — at cost, with no margin markup.

> Save 70–90% on LLM costs compared to bundled AI providers.

---

## What is HiWay2LLM?

HiWay2LLM is a **BYOK (Bring Your Own Key) LLM gateway** that routes your requests to the best model based on your choice, while handling:

- **Unified API** — one endpoint, all providers (OpenAI, Anthropic, Google, Mistral, Perplexity)
- **Transparent pricing** — you pay provider cost + a small platform fee, never a hidden markup
- **Smart routing** — auto-selects optimal model tier based on your budget and task
- **Detailed usage tracking** — per-request cost, tokens, model used

## Installation

In your n8n instance, go to **Settings > Community Nodes** and install:

```
n8n-nodes-hiway2llm
```

## Setup

1. Create a free account at [app.hiway2llm.com](https://app.hiway2llm.com)
2. Generate an API key in **Settings > API Keys** (format: `hw_live_...`)
3. In n8n, add a new **HiWay2LLM API** credential with your key
4. Drop the **HiWay2LLM** node into any workflow

## Operations

### Chat
Send a message to any supported model and get a text response.

**Parameters:**
| Field | Description |
|-------|-------------|
| Model | Choose from 15+ models across 5 tiers |
| System Prompt | Optional instruction for the model |
| User Message | The prompt to send |
| Additional Messages | Inject conversation history (JSON array) |
| Temperature | Creativity control (0–2) |
| Max Tokens | Response length limit |
| Response Format | Text or JSON Object |
| Return Full Response | Get the full OpenAI-format object |

**Output (default):**
```json
{
  "text": "Your answer here...",
  "finish_reason": "stop",
  "model": "anthropic/claude-sonnet-4-6",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 120,
    "total_tokens": 165
  }
}
```

### List Models
Returns all models available on your HiWay2LLM plan, with tier and provider info.

```json
{
  "id": "anthropic/claude-sonnet-4-6",
  "object": "model",
  "owned_by": "anthropic",
  "hiway_tier": "standard",
  "hiway_provider": "anthropic"
}
```

## Supported Models

| Tier | Models |
|------|--------|
| **Ultra-Light** | Gemini 2.5 Flash Lite, GPT-4o Mini, Mistral Small |
| **Light** | Claude Haiku 4.5 |
| **Standard** | Claude Sonnet 4.6, GPT-4o, Gemini 2.5 Flash, Mistral Large |
| **Heavy** | Claude Opus 4.7, GPT-5, Gemini 2.5 Pro |
| **Web Search** | Perplexity Sonar, Sonar Pro, Sonar Reasoning |

## Example Workflows

### Content generation pipeline
```
HTTP Trigger → HiWay2LLM (Chat, Sonnet) → Airtable (Save)
```

### Cost-aware classification
```
Webhook → HiWay2LLM (Chat, GPT-4o Mini) → Switch → ...
```

### Research agent
```
Schedule → HiWay2LLM (Chat, Perplexity Sonar Pro) → Notion
```

## Links

- **Dashboard & API keys**: [app.hiway2llm.com](https://app.hiway2llm.com)
- **Documentation**: [app.hiway2llm.com/docs](https://app.hiway2llm.com/docs)
- **GitHub**: [github.com/Black-Mytm/n8n-nodes-hiway2llm](https://github.com/hiway2llm/n8n-nodes-hiway2llm)
- **Issues**: [github.com/Black-Mytm/n8n-nodes-hiway2llm/issues](https://github.com/hiway2llm/n8n-nodes-hiway2llm/issues)

## License

MIT — © 2025 [Mytm-Group](https://mytm-group.com)
