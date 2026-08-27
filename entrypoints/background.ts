export default defineBackground(() => {
  browser.commands.onCommand.addListener(async (command) => {
    if (command !== 'magnify-focus') return;
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, { type: 'WP_MAGNIFY_FOCUS', duration: 12000 }).catch(() => undefined);
    }
  });
});
