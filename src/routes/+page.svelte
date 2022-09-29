<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { Editor, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import { localStore } from 'svelte-persistent';
	import writableDerived from 'svelte-writable-derived';

	let store = localStore('key', 'defaultValue');

	let element: HTMLDivElement;
	let editor: Editor;
	let content: Writable<JSONContent> = writableDerived(
		localStore('content', '{}'),
		JSON.parse,
		JSON.stringify
	);

	$: {
		if (editor) $content = editor.getJSON() ?? {};
	}

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					bulletList: false,
					orderedList: false
				}),
				Placeholder.configure({
					placeholder: 'Type anything...'
				})
			],
			content: $content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={element} />

<style>
	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global(.ProseMirror) {
		outline: none;
		min-height: calc(100vh - 4rem);
		padding: 2rem;
		font-family: monospace;
	}

	:global(p) {
		margin-top: 0px;
		margin-bottom: 0px;
	}
</style>
