<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { MiAuth } from '$lib/miauth.svelte';
	import { updateCookie, notes, getCookie, accessToken } from '$lib/store';
	import { getNotes, init } from '$lib/misskey';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { note } from 'misskey-js';

	const miAuth = new MiAuth();
	let authed = $state(false);

	let withRenotes = $state(true);
	let timeline = $state<'home' | 'local' | 'social' | 'global'>('local');

	onMount(() => {
		getCookie();
		if (get(accessToken)) {
			init();
			authed = true;
		}
	});
	const auth = async () => {
		await miAuth.requestToken();
		updateCookie();
		init();
		authed = true;
	};
</script>

{#if !authed}
	<div class="outer text-white">
		<div class="inner text-center">
			<div
				class="text-8xl font-bold tracking-widest text-shadow-[0_0px_10px_rgb(255_255_255_/_0.5)]"
			>
				GEKIEROTL
			</div>

			<div class="my-4 flex flex-row justify-center gap-4">
				<div>自己責任において利用すること</div>
				<div>自分の性癖と合わない画像が突然出てきても泣かないこと</div>
			</div>

			{#if miAuth.isTokenReady}
				<button class="btn btn-secondary btn-xl" onclick={auth}> 認証完了後クリック </button>
			{:else}
				<button class="btn btn-primary btn-xl" onclick={() => open(miAuth.getUrl())}> 認証 </button>
			{/if}
		</div>
	</div>

	<a
		href={PUBLIC_SERVER_URL}
		target="_blank"
		class="fixed bottom-4 w-screen text-center text-white underline hover:no-underline"
	>
		{PUBLIC_SERVER_URL}
	</a>
{:else}
	<div class="card w-full border-b-2 bg-transparent">
		<div class="card-body flex flex-row items-baseline justify-between gap-2 md:gap-16">
			<h1 class="text-sm font-bold tracking-widest text-white md:text-4xl">GEKIEROTL</h1>
			<fieldset class="fieldset min-w-40">
				<legend class="fieldset-legend">タイムライン</legend>
				<select class="select" bind:value={timeline}>
					<option value="local">ローカル</option>
					<option value="home">ホーム</option>
					<option value="social">ソーシャル</option>
					<option value="global">グローバル</option>
				</select>
			</fieldset>
			<!-- <label class="label cursor-pointer">
				<span class="label-text m-4 text-lg">リノートを含める</span>
				<input type="checkbox" class="toggle bg-base-100" bind:checked={withRenotes} />
			</label> -->
			<button
				class="btn md:btn-xl btn-secondary"
				onclick={() => {
					notes.set([]);
					getNotes(timeline, undefined, withRenotes);
				}}
			>
				ノート取得
			</button>
		</div>
	</div>

	<div class="mt-8 columns-2 gap-8 px-2 md:columns-3 lg:columns-4">
		{#each $notes as note}
			{#if note.files!.length >= 1}
				{#if note.files![0].type.match(/image\//)}
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<a
						href={note.url ? note.url : `${PUBLIC_SERVER_URL}/notes/${note.id}`}
						target="_blank"
						class="before:bg-opacity-20 group relative before:absolute before:inset-0 before:rounded-md before:content-['']"
					>
						<img
							class="my-8 w-full rounded-md shadow-sm transition-all duration-300 group-hover:shadow-2xl"
							src={note.files![0].url}
							alt="note"
						/>
						<div
							class="test__body absolute inset-0 flex p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<div class="mt-auto">
								<div class="avatar">
									<div class="w-10 rounded-full">
										<img src={note.user.avatarUrl} alt="user icon" />
									</div>
								</div>
								{#if note.files!.length > 1}
									<div class="badge badge-secondary absolute top-0 right-0 m-2 shadow-md">
										More {note.files!.length - 1} File
									</div>
								{/if}
							</div>
						</div>
					</a>
				{/if}
			{/if}
		{/each}
	</div>

	{#if $notes.length > 0}
		<button
			class="btn btn-block btn-xl my-16"
			onclick={() => getNotes(timeline, $notes[$notes.length - 1].id, withRenotes)}
		>
			さらに読み込む
		</button>
	{/if}
{/if}

<style>
	.outer {
		position: relative;
		width: 100svw;
		height: 100svh;
	}
	.inner {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		width: 80%;
		height: 3.2rem;
	}
</style>
