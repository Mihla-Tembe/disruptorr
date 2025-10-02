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
  `
  // In the App Router, an inline script is acceptable; it runs early in body
  return <script dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning />
}

