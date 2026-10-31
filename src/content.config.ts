import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const tekster = defineCollection({
    loader: glob({base: './src/content/tekster', pattern: '**/*.md'}),
    schema: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.coerce.date(),
        draft: z.boolean().default(false),
    }),
});

export const collections = {tekster};
