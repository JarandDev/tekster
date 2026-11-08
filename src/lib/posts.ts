import {getCollection} from 'astro:content';
import type {CollectionEntry} from 'astro:content';

export async function getPosts() {
    return (await getCollection('tekster', ({data}) => import.meta.env.DEV || !data.draft))
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

export function getPostPath(post: CollectionEntry<'tekster'>) {
    const date = post.data.date.toISOString().slice(0, 10);
    const match = post.id.match(/(^|\/)(\d{4}-\d{2}-\d{2})-/);
    if (match && match[2] !== date) {
        throw new Error(`Datoen i filnavnet for "${post.id}" (${match[2]}) stemmer ikke med datoen i metadataene (${date}).`);
    }
    const id = match ? post.id.replace(match[0], match[1]) : post.id;
    return `${date}/${id}`;
}

export function formatDate(date: Date) {
    return new Intl.DateTimeFormat('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}
