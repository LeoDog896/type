<script lang="ts">
	import type { Writable } from 'svelte/store';
	import '../prose.scss';
	import { onMount, onDestroy } from 'svelte';
	import { persisted } from 'svelte-local-storage-store'

	import { Editor, type JSONContent } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import CodeBlock from '@tiptap/extension-code-block';
	import Lowlight from '@tiptap/extension-code-block-lowlight';
	import Text from '@tiptap/extension-text';
	import Paragraph from '@tiptap/extension-paragraph';
	import Placeholder from '@tiptap/extension-placeholder';
	import Bold from '@tiptap/extension-bold';
	import Code from '@tiptap/extension-code';
	import Italic from '@tiptap/extension-italic';
	import Strike from '@tiptap/extension-strike';
	import Dropcursor from '@tiptap/extension-dropcursor';
	import Gapcursor from '@tiptap/extension-gapcursor';
	import History from '@tiptap/extension-history';
	import Heading from '@tiptap/extension-heading'
	import Image from '@tiptap/extension-image'
	import ListItem from '@tiptap/extension-list-item'

	import { lowlight } from 'lowlight/lib/core';
	import css from 'highlight.js/lib/languages/css';
	import js from 'highlight.js/lib/languages/javascript';
	import ts from 'highlight.js/lib/languages/typescript';
	import html from 'highlight.js/lib/languages/xml';
	import rust from 'highlight.js/lib/languages/rust';
	import go from 'highlight.js/lib/languages/go';
	import java from 'highlight.js/lib/languages/java';
	import kotlin from 'highlight.js/lib/languages/kotlin';
	import scala from 'highlight.js/lib/languages/scala';

	lowlight.registerLanguage('html', html);
	lowlight.registerLanguage('css', css);
	lowlight.registerLanguage('js', js);
	lowlight.registerLanguage('ts', ts);
	lowlight.registerLanguage('rust', rust);
	lowlight.registerLanguage('go', go);
	lowlight.registerLanguage('java', java);
	lowlight.registerLanguage('kotlin', kotlin);
	lowlight.registerLanguage('scala', scala);

	let element: HTMLDivElement;
	let editor: Editor;
	let content: Writable<JSONContent> = persisted(
		'leodog896/type/content', {}
	);

	$: if (editor) $content = editor.getJSON() ?? {};

	onMount(() => {
		const extendedKit = Document.extend({
			addKeyboardShortcuts() {
				return {
					Tab: () => this.editor.commands.insertContent('\t')
				};
			}
		});

		editor = new Editor({
			element: element,
			extensions: [
				extendedKit,
				Text,
				Paragraph,
				CodeBlock,
				Lowlight.configure({ lowlight }),
				Bold,
				Code,
				Italic,
				Strike,
				History,
				Gapcursor,
				Dropcursor,
				Heading,
				ListItem,
				Image,
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
