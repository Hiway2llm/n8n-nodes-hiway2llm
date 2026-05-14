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
			description: 'Your HiWay2LLM API key — get one at app.hiway2llm.com/settings/api-keys',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.hiway2llm.com',
			description: 'HiWay2LLM API base URL (leave default unless self-hosted)',
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
