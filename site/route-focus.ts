const heading = document.querySelector<HTMLElement>('h1');
if (heading) heading.tabIndex = -1;
function focusHeading() { heading?.focus({ preventScroll: true }); }
function restoreFocus() {
  const href = sessionStorage.getItem('wp:return-focus');
  const link = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].find((item) => item.getAttribute('href') === href);
  (link ?? heading)?.focus({ preventScroll: true });
  sessionStorage.removeItem('wp:return-focus');
}
const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
if (navigation?.type === 'back_forward') queueMicrotask(restoreFocus);
else if (document.referrer.startsWith(location.origin)) queueMicrotask(focusHeading);
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (link && link.origin === location.origin && !link.hasAttribute('download')) sessionStorage.setItem('wp:return-focus', link.getAttribute('href') ?? '');
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) restoreFocus();
});
