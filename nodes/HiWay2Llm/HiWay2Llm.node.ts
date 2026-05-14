import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';

const MODELS = [
	{
		name: 'Ultra-Light',
		value: '__group_ultra_light__',
		description: '── Ultra-Light ────────────────────',
	},
	{ name: 'Gemini 2.5 Flash Lite', value: 'google/gemini-2.5-flash-lite' },
	{ name: 'GPT-4o Mini', value: 'openai/gpt-4o-mini' },
	{ name: 'Mistral Small', value: 'mistral/mistral-small-latest' },
	{
		name: 'Light',
		value: '__group_light__',
		description: '── Light ───────────────────────────',
	},
	{ name: 'Claude Haiku 4.5', value: 'anthropic/claude-haiku-4-5' },
	{
		name: 'Standard',
		value: '__group_standard__',
		description: '── Standard ────────────────────────',
	},
	{ name: 'Claude Sonnet 4.6', value: 'anthropic/claude-sonnet-4-6' },
	{ name: 'GPT-4o', value: 'openai/gpt-4o' },
	{ name: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' },
	{ name: 'Mistral Large', value: 'mistral/mistral-large-latest' },
	{
		name: 'Heavy',
		value: '__group_heavy__',
		description: '── Heavy ───────────────────────────',
	},
	{ name: 'Claude Opus 4.7', value: 'anthropic/claude-opus-4-7' },
	{ name: 'GPT-5', value: 'openai/gpt-5' },
	{ name: 'Gemini 2.5 Pro', value: 'google/gemini-2.5-pro' },
	{
		name: 'Web Search',
		value: '__group_web__',
		description: '── Web Search (Perplexity) ──────────',
	},
	{ name: 'Perplexity Sonar', value: 'perplexity/sonar' },
	{ name: 'Perplexity Sonar Pro', value: 'perplexity/sonar-pro' },
	{ name: 'Perplexity Sonar Reasoning', value: 'perplexity/sonar-reasoning' },
	{
		name: 'Custom (enter model ID)',
		value: 'custom',
		description: 'Enter any model ID manually',
	},
];

export class HiWay2Llm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HiWay2LLM',
		name: 'hiWay2Llm',
		icon: 'file:hiway2llm.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Smart LLM router — access GPT-4o, Claude, Gemini & more with BYOK pricing. Save 70-90% vs direct API costs.',
		defaults: { name: 'HiWay2LLM' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hiWay2LlmApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
						description: 'Send a chat completion request',
						action: 'Send a chat completion request',
					},
					{
						name: 'List Models',
						value: 'listModels',
						description: 'List all available models and their tiers',
						action: 'List all available models',
					},
				],
				default: 'chat',
			},

			// ── CHAT ────────────────────────────────────────────────────────────
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				displayOptions: { show: { operation: ['chat'] } },
				options: MODELS,
				default: 'anthropic/claude-sonnet-4-6',
				description: 'The model to use for completion',
			},
			{
				displayName: 'Custom Model ID',
				name: 'customModel',
				type: 'string',
				displayOptions: {
					show: { operation: ['chat'], model: ['custom'] },
				},
				default: '',
				placeholder: 'e.g. openai/gpt-4-turbo',
				description: 'Enter the full model ID (provider/model-name)',
			},
			{
				displayName: 'System Prompt',
				name: 'systemPrompt',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { operation: ['chat'] } },
				default: '',
				description: 'Optional system instruction for the model',
				placeholder: 'You are a helpful assistant...',
			},
			{
				displayName: 'User Message',
				name: 'userMessage',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { operation: ['chat'] } },
				default: '',
				required: true,
				description: 'The user message to send',
			},
			{
				displayName: 'Additional Messages (JSON)',
				name: 'additionalMessages',
				type: 'json',
				displayOptions: { show: { operation: ['chat'] } },
				default: '[]',
				description:
					'Optional array of additional messages in OpenAI format: [{"role":"assistant","content":"..."}]. Inserted between system and user message.',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: { show: { operation: ['chat'] } },
				default: {},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 2 },
						default: 1,
						description: 'Sampling temperature (0 = deterministic, 2 = very creative)',
					},
					{
						displayName: 'Max Tokens',
						name: 'maxTokens',
						type: 'number',
						typeOptions: { minValue: 1 },
						default: 1024,
						description: 'Maximum number of tokens to generate',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						type: 'number',
						typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
						default: 1,
						description: 'Nucleus sampling probability',
					},
					{
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						type: 'number',
						typeOptions: { minValue: -2, maxValue: 2, numberPrecision: 2 },
						default: 0,
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						type: 'number',
						typeOptions: { minValue: -2, maxValue: 2, numberPrecision: 2 },
						default: 0,
					},
					{
						displayName: 'Seed',
						name: 'seed',
						type: 'number',
						default: 0,
						description: 'Random seed for reproducible outputs (0 = disabled)',
					},
					{
						displayName: 'Response Format',
						name: 'responseFormat',
						type: 'options',
						options: [
							{ name: 'Text', value: 'text' },
							{ name: 'JSON Object', value: 'json_object' },
						],
						default: 'text',
						description: 'Force the model to output in a specific format',
					},
					{
						displayName: 'Return Full Response',
						name: 'returnFull',
						type: 'boolean',
						default: false,
						description:
							'Whether to return the full OpenAI-format response object instead of just the text content',
					},
				],
			},

			// ── LIST MODELS ──────────────────────────────────────────────────────
			{
				displayName: 'Filter by Tier',
				name: 'tierFilter',
				type: 'options',
				displayOptions: { show: { operation: ['listModels'] } },
				options: [
					{ name: 'All Tiers', value: 'all' },
					{ name: 'Ultra-Light', value: 'ultra_light' },
					{ name: 'Light', value: 'light' },
					{ name: 'Standard', value: 'standard' },
					{ name: 'Heavy', value: 'heavy' },
					{ name: 'Web Search', value: 'web_search' },
					{ name: 'Image', value: 'image' },
				],
				default: 'all',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('hiWay2LlmApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
		const apiKey = credentials.apiKey as string;

		const results: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				if (operation === 'chat') {
					const modelParam = this.getNodeParameter('model', i) as string;
					const model =
						modelParam === 'custom'
							? (this.getNodeParameter('customModel', i) as string)
							: modelParam;

					if (!model || model.startsWith('__group_')) {
						throw new NodeOperationError(this.getNode(), 'Please select a valid model.', {
							itemIndex: i,
						});
					}

					const systemPrompt = this.getNodeParameter('systemPrompt', i, '') as string;
					const userMessage = this.getNodeParameter('userMessage', i) as string;
					const additionalMessagesRaw = this.getNodeParameter(
						'additionalMessages',
						i,
						'[]',
					) as string;
					const options = this.getNodeParameter('options', i, {}) as IDataObject;

					const messages: Array<{ role: string; content: string }> = [];
					if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

					let additionalMessages: Array<{ role: string; content: string }> = [];
					try {
						additionalMessages =
							typeof additionalMessagesRaw === 'string'
								? JSON.parse(additionalMessagesRaw)
								: additionalMessagesRaw;
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'Additional Messages must be valid JSON.',
							{ itemIndex: i },
						);
					}
					messages.push(...additionalMessages);
					messages.push({ role: 'user', content: userMessage });

					const body: IDataObject = { model, messages };

					if (options.temperature !== undefined) body.temperature = options.temperature;
					if (options.maxTokens !== undefined) body.max_tokens = options.maxTokens;
					if (options.topP !== undefined && (options.topP as number) !== 1)
						body.top_p = options.topP;
					if (options.frequencyPenalty !== undefined && (options.frequencyPenalty as number) !== 0)
						body.frequency_penalty = options.frequencyPenalty;
					if (options.presencePenalty !== undefined && (options.presencePenalty as number) !== 0)
						body.presence_penalty = options.presencePenalty;
					if (options.seed && (options.seed as number) !== 0) body.seed = options.seed;
					if (options.responseFormat && options.responseFormat !== 'text')
						body.response_format = { type: options.responseFormat };

					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: `${baseUrl}/v1/chat/completions`,
						headers: {
							Authorization: `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					});

					if (options.returnFull) {
						results.push({ json: response as IDataObject, pairedItem: { item: i } });
					} else {
						const content = (response as IDataObject).choices as Array<{
							message: { content: string };
							finish_reason: string;
						}>;
						const text = content?.[0]?.message?.content ?? '';
						const finishReason = content?.[0]?.finish_reason ?? '';
						const usage = (response as IDataObject).usage as IDataObject;
						const routedModel = (response as IDataObject).model as string;

						results.push({
							json: { text, finish_reason: finishReason, model: routedModel, usage },
							pairedItem: { item: i },
						});
					}
				} else if (operation === 'listModels') {
					const tierFilter = this.getNodeParameter('tierFilter', i, 'all') as string;

					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/v1/models`,
						headers: { Authorization: `Bearer ${apiKey}` },
						json: true,
					});

					let models = ((response as IDataObject).data as IDataObject[]) ?? [];

					if (tierFilter !== 'all') {
						models = models.filter((m) => m.hiway_tier === tierFilter);
					}

					for (const model of models) {
						results.push({ json: model, pairedItem: { item: i } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					results.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				if (error instanceof NodeApiError || error instanceof NodeOperationError) throw error;
				throw new NodeApiError(this.getNode(), error as unknown as { message: string }, { itemIndex: i });
			}
		}

		return [results];
	}
}
