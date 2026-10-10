"""Validate published-page metadata, preview assets, and per-domain sitemaps."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import struct
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
class Head(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.canonical = []; self.title = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta':
            key = attrs.get('property', attrs.get('name'))
            if key in self.meta and key != 'theme-color': raise AssertionError('Duplicate metadata: ' + key)
            self.meta[key] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical.append(attrs['href'])
        if tag == 'title': self.title += 1

pages = [ROOT / 'index.html'] + list(ROOT.glob('*/index.html')) + list((ROOT / 'renfo').glob('*/index.html')) + list((ROOT / 'homestead').glob('*/index.html')) + list((ROOT / 'iwatch').glob('*/index.html'))
canonical = set()
for page in pages:
    h = Head(); h.feed(page.read_text())
    assert h.title == 1 and len(h.canonical) == 1, page
    url = h.canonical[0]; canonical.add(url)
    assert h.meta['og:url'] == url
    assert urlparse(url).scheme == 'https'
    for key in ['description', 'og:title', 'og:description', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']:
        assert h.meta.get(key), (page, key)
    assert h.meta['twitter:card'] == 'summary_large_image'
    assert h.meta['og:image'] == h.meta['twitter:image']
    image = ROOT / urlparse(h.meta['og:image']).path.lstrip('/')
    raw = image.read_bytes()
    assert raw[:8] == b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II', raw[16:24]) == (1200, 630)
    assert h.meta['og:image:width'] == '1200' and h.meta['og:image:height'] == '630'
listed = set()
for file, host in [('sitemap.xml', 'tylerkeegan.com'), ('renfo/sitemap.xml', 'renfo.app'), ('homestead/sitemap.xml', 'homesteadcontrol.com')]:
    root = ET.parse(ROOT / file).getroot()
    for loc in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
        assert urlparse(loc.text).hostname == host
        assert loc.text not in listed
        listed.add(loc.text)
assert listed == canonical, (listed, canonical)
print(f'Validated metadata and preview images for {len(pages)} pages; all canonical URLs appear in the correct sitemap.')
