import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HiWay2LlmApi implements ICredentialType {
	name = 'hiWay2LlmApi';
	displayName = 'HiWay2LLM API';
	documentationUrl = 'https://app.hiway2llm.com/settings/api-keys';
	icon = 'file:../nodes/HiWay2Llm/hiway2llm.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'hw_live_...',
			description: 'Your HiWay2LLM API key. <a href="https://app.hiway2llm.com/auth" target="_blank">Create a free account</a>, then go to <a href="https://app.hiway2llm.com/settings/api-keys" target="_blank">Settings → API Keys</a> to generate your key.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.hiway2llm.com',
			description: 'HiWay2LLM API base URL. Leave default unless you are self-hosting.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/health',
			method: 'GET',
		},
	};
}
