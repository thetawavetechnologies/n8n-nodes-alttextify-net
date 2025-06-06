import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class AltTextify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AltTextify',
		name: 'AltTextify',
		icon: { light: 'file:alttextify.svg', dark: 'file:alttextify.svg' },
		group: ['transform'],
		version: 1,
		description: 'Generate alt text using AltTextify API',
		defaults: { name: 'AltTextify' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'AltTextifyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Image', value: 'image' },
				],
				default: 'image',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Generate Alt Text', value: 'generateAltText' },
				],
				default: 'generateAltText',
			},
			{
				displayName: 'Image URL',
				name: 'image',
				type: 'string',
				default: '',
				required: true,
				description: 'Provide a publicly accessible image URL in JPEG, PNG, GIF, WEBP, or BMP format',
			},
			{
				displayName: 'Language',
				name: 'lang',
				type: 'string',
				default: 'en',
				description: 'Provide a language code for the alt text output. Defaults to English (en). Accepts ISO 639-1 codes such as pt (Portuguese), de (German), etc.',
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				default: '',
				description: 'List of keywords/phrases for SEO optimized alt text. Only one or two will be used per alt text, but all are considered. Keywords must be in English, even for alt text in other languages.',
			},
			{
				displayName: 'Product Name [Ecommerce]',
				name: 'product_name',
				type: 'string',
				default: '',
				description: 'Product name to be included in the final Alt Text',
			},
			{
				displayName: 'Brand Name [Ecommerce]',
				name: 'brand_name',
				type: 'string',
				default: '',
				description: 'Brand name to be included in the final Alt Text',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('AltTextifyApi');
		const length = items.length;

		for (let i = 0; i < length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'image' && operation === 'generateAltText') {
					const image = this.getNodeParameter('image', i) as string;
					const lang = this.getNodeParameter('lang', i) as string;
					const keywords = this.getNodeParameter('keywords', i) as string;
					const product_name = this.getNodeParameter('product_name', i) as string;
					const brand_name = this.getNodeParameter('brand_name', i) as string;

					const response = await altTextifyApiRequest.call(this, {
						apiKey: credentials.apiKey,
						image,
						lang,
						keywords,
						product_name,
						brand_name,
					});

					returnData.push({ json: response });
				}
			} catch (error) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			}
		}

		return [returnData];
	}
}

// Helper function for API request
async function altTextifyApiRequest(this: IExecuteFunctions, params: any): Promise<any> {
	const options = {
		method: 'POST',
		url: 'https://api.alttextify.net/api/v1/image/url',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${params.apiKey}`
		},
		body: {
			image: params.image,
			lang: params.lang,
			keywords: params.keywords,
			ecommerce: {
				product: {
					name: params.product_name,
					brand: params.brand_name,
				},
			},
			async: false,
		},
		json: true,
	};

	return this.helpers.request(options as IRequestOptions);
}



// import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionType, IRequestOptions } from 'n8n-workflow';
// import { OptionsWithUri } from 'request';

// export class AltTextify implements INodeType {
// 	description: INodeTypeDescription = {
// 		displayName: 'AltTextify',
// 		name: 'altTextify',
// 		group: ['transform'],
// 		version: 1,
// 		description: 'Generate alt text using AltTextify API',
// 		defaults: {
// 			name: 'AltTextify',
// 		},
// 		inputs: [NodeConnectionType.Main],
// 		outputs: [NodeConnectionType.Main],
//         credentials: [
//             {
//                 name: 'AltTextifyApi',
//                 required: true,
//             },
//         ],		
// 		properties: [
// 			{
// 				displayName: 'Image URL',
// 				name: 'image',
// 				type: 'string',
// 				default: '',
// 				required: true,
				
// 				description: 'Provide a publicly accessible image URL in JPEG, PNG, GIF, WEBP, or BMP format.',
// 			},
// 			{
// 				displayName: 'Language',
// 				name: 'lang',
// 				type: 'string',
// 				default: 'en',
// 				description: 'Provide a language code for the alt text output. Defaults to English (en). Accepts ISO 639-1 codes such as pt (Portuguese), de (German), etc.',
// 			},
//             {
// 				displayName: 'Keywords',
// 				name: 'keywords',
// 				type: 'string',
// 				default: '',
// 				description: 'List of keywords/phrases for SEO optimized alt text. Only one or two will be used per alt text, but all are considered. Keywords must be in English, even for alt text in other languages.',
// 			},
//             {
// 				displayName: 'Product Name [Ecommerce]',
// 				name: 'product_name',
// 				type: 'string',
// 				default: '',
// 				description: 'Product name to be included in the final Alt Text.',
// 			},
//             {
// 				displayName: 'Brand Name [Ecommerce]',
// 				name: 'brand_name',
// 				type: 'string',
// 				default: '',
// 				description: 'Brand name to be included in the final Alt Text.',
// 			}
// 		],
// 	};

// 	async execute(this: IExecuteFunctions) {
// 		const items = this.getInputData();
// 		const returnData = [];

// 		for (let i = 0; i < items.length; i++) {
// 			const imageUrl = this.getNodeParameter('image', i) as string;
// 			const lang = this.getNodeParameter('lang', i) as string;
//             const keywords = this.getNodeParameter('keywords', i) as string;
//             const product_name = this.getNodeParameter('product_name', i) as string;
//             const brand_name = this.getNodeParameter('brand_name', i) as string;

// 			const options: OptionsWithUri = {
// 				method: 'POST',
// 				uri: 'https://webhook.site/920ca63b-5c8e-4988-8f78-117da8f452b4',
// 				body: {
// 					image: imageUrl,
// 					lang,
//                     keywords,
//                     ecommerce: {
//                         product: {
//                             name: product_name,
//                             brand: brand_name,
//                         },
//                     },
//                     async: true,
// 				},
// 				json: true,
// 			};

// 			const response = await this.helpers.request(options as IRequestOptions);      
// 			returnData.push({ json: response });
// 		}

// 		return this.prepareOutputData(returnData);
// 	}
// }
