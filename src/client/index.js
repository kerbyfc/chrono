import App from './components/App.svelte';

const app = new App({
	target: document.getElementById('application'),
	props: {
		name: 'world'
	}
});

export default app;
