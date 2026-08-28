import './style.css';
import './route-focus';

if (new URLSearchParams(location.search).get('demo') === '1') location.replace('/demo/');
if ('serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
