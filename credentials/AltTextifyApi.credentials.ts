import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AltTextifyApi implements ICredentialType {
	name = 'altTextifyApi';
	displayName = 'AltTextify API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes

	documentationUrl = 'https://alttextify.net/faq#apiTarget';

	icon = {
		light: 'file:icons/alttextify.svg',
		dark: 'file:icons/alttextify.svg',
	} as const;

	httpRequestNode = {
		name: 'AltTextify',
		docsUrl: 'https://apidoc.alttextify.net/',
		apiBaseUrlPlaceholder: 'https://api.alttextify.net/api/v1',
	};
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
			description: 'API Key for AltTextify API. Get it from https://alttextify.net/settings/apikeys',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'authorization': '=Bearer {{$credentials.apiKey}}'
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.alttextify.net/api/v1',
			url: '/nc/apikey',
			method: 'GET',
			headers: {
				'authorization': '=Bearer {{$credentials.apiKey}}'
			},
		},
	}
};