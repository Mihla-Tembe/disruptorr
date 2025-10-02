export function ThemeScript() {
  const code = `
  try {
    var t = localStorage.getItem('disruptor.theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
