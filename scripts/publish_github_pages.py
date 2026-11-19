"""Prepare the repository root for Pages (main / root), preserving dist for Sites."""

from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'dist'
PREFIX = '/MOVA-CREATIVE'
ORIGIN = 'https://emiiramoos.github.io' + PREFIX
ORIGINAL_ORIGIN = 'https://mova-creative.emiliorp-srch-uni.chatgpt.site'
TEXT_TYPES = {'.html', '.css', '.js', '.svg', '.txt', '.json'}


def for_pages(text):
    # Includes srcset entries, CSS URLs, and JS-assigned hero video sources.
    # Leave protocol-relative and external URLs, fragments and imports intact.
    text = re.sub(r'''(["'`(])/(?=[\w#?]|["'`])''',
                  lambda match: match[1] + PREFIX + '/', text)
    text = re.sub(r'(,\s*)/(assets|fonts)/',
                  lambda match: match[1] + PREFIX + '/' + match[2] + '/', text)
    return text.replace(ORIGINAL_ORIGIN, ORIGIN)


def publish():
    if not (SOURCE / 'index.html').is_file():
        raise SystemExit('Build dist/index.html before preparing GitHub Pages.')
    count = 0
    for source in sorted(SOURCE.rglob('*')):
        if not source.is_file():
            continue
        target = ROOT / source.relative_to(SOURCE)
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.suffix in TEXT_TYPES:
            target.write_text(for_pages(source.read_text(encoding='utf-8')),
                              encoding='utf-8')
        else:
            shutil.copyfile(source, target)
        count += 1
    (ROOT / '.nojekyll').write_text('', encoding='utf-8')
    print(f'Prepared {count} files for {ORIGIN}/')


if __name__ == '__main__':
    publish()
