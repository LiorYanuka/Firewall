import 'dotenv/config';
import { config as appConfig } from './src/config/env';

export default {
	schema: './src/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: appConfig.databaseUri,
	},
} as const;