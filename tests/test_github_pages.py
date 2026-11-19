"""Regression checks for the deployed Pages URLs, including nested routes."""

from html.parser import HTMLParser
from pathlib import Path
import sys
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from publish_github_pages import PREFIX, for_pages


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        self.urls.extend(attrs[k] for k in ('href', 'src', 'poster', 'data-src')
                         if attrs.get(k))
        self.urls.extend(part.strip().split()[0]
                         for part in attrs.get('srcset', '').split(',') if part.strip())


class PagesTests(unittest.TestCase):
    def test_transforms_runtime_and_srcset_paths(self):
        original = '''srcset="/assets/a.webp 640w, /assets/b.webp 1080w"
src='/assets/hero.mp4'; location.assign('/contacto/'); href="/"
url('/fonts/font.woff'); url(/assets/photo.webp)'''
        result = for_pages(original)
        for path in ('assets/a.webp', 'assets/b.webp', 'assets/hero.mp4',
                     'contacto/', 'fonts/font.woff', 'assets/photo.webp'):
            self.assertIn(PREFIX + '/' + path, result)
        self.assertIn('href="' + PREFIX + '/"', result)

    def test_preserves_comments_imports_external_urls_and_arithmetic(self):
        original = '''import './loop-media.js'; // Comment
try {} catch { /* Keep poster. */ }
const progress = top / Math.max(1, height);
href="https://wa.me/529982401868"; src="//example.com/image"; href="#main"'''
        self.assertEqual(for_pages(original), original)

    def test_all_deployed_html_references_exist(self):
        self.assertTrue((ROOT / '.nojekyll').exists())
        self.assertIn('cinema-chapter', (ROOT / 'index.html').read_text())
        for source in (ROOT / 'dist').rglob('*.html'):
            page = ROOT / source.relative_to(ROOT / 'dist')
            parser = References()
            parser.feed(page.read_text())
            for ref in parser.urls:
                with self.subTest(page=str(page.relative_to(ROOT)), ref=ref):
                    url = urlsplit(ref)
                    if url.scheme or url.netloc:
                        continue
                    if url.path.startswith('/'):
                        self.assertTrue(url.path.startswith(PREFIX + '/'))
                        target = ROOT / unquote(url.path[len(PREFIX) + 1:])
                    elif url.path:
                        target = page.parent / unquote(url.path)
                    else:
                        target = page
                    if target.is_dir():
                        target /= 'index.html'
                    self.assertTrue(target.is_file(), str(target))


if __name__ == '__main__':
    unittest.main()
