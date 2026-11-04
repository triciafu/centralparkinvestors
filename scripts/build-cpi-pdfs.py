"""Rebuild downloadable PDFs from source/site case HTML, with live hyperlinks.

Requires Python 3, reportlab, lxml, and pypdf. No network access is required.
Use --output-dir to preview without replacing the website downloads.
"""
import argparse
from collections import Counter
from html import escape
from pathlib import Path
import re
from tempfile import TemporaryDirectory
from urllib.parse import unquote, urljoin

from lxml import html
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://centralparkinvestors.com'


def register_fonts():
    for weight in ('Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'Italic', 'BoldItalic'):
        name = 'Montserrat-' + weight
        pdfmetrics.registerFont(TTFont(name, str(ROOT / 'assets/fonts/montserrat' / (name + '.ttf'))))
    for weight in ('Light', 'Regular', 'Medium', 'SemiBold', 'Bold'):
        pdfmetrics.registerFontFamily('Montserrat-' + weight, normal='Montserrat-' + weight,
                                     bold='Montserrat-Bold', italic='Montserrat-Italic',
                                     boldItalic='Montserrat-BoldItalic')


def clean(text):
    return (text or '').replace('\u00a0', ' ').replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', ' - ')


def inline(node, route):
    result = escape(clean(node.text))
    for child in node:
        if not isinstance(child.tag, str):
            continue
        content = inline(child, route)
        if child.tag == 'br':
            content = '<br/>'
        elif child.tag == 'a' and child.get('href'):
            href = urljoin(SITE + route, child.get('href'))
            content = '<a href="' + escape(href, quote=True) + '" color="#234c74"><u>' + content + '</u></a>'
            weight = 'Bold' if re.search(r'font-weight:\s*(?:700|bold)', child.get('style', '')) else 'Regular'
            content = '<font name="Montserrat-' + weight + '">' + content + '</font>'
        elif child.tag in ('b', 'strong'):
            content = '<b>' + content + '</b>'
        elif child.tag in ('em', 'i'):
            content = '<i>' + content + '</i>'
        result += content + escape(clean(child.tail))
    return result


def tokens(text):
    return Counter(re.findall(r'\w+', clean(text).casefold()))


def build(source, output):
    tree = html.fromstring(source.read_text())
    route = '/' + source.parent.relative_to(ROOT / 'source/site').as_posix() + '/'
    title = ' '.join(tree.xpath('//main//h1')[0].itertext()).strip()
    content = tree.xpath('//main//*[contains(concat(" ", normalize-space(@class), " "), " rte ")]')[0]
    tables = content.xpath('.//table')
    wide = any(len(t.xpath('./thead/tr/th')) >= 5 for t in tables)
    pagesize = landscape(letter) if wide else letter
    width = pagesize[0] - 1.2 * inch
    body = ParagraphStyle('Body', fontName='Montserrat-Light', fontSize=10, leading=14, spaceAfter=9)
    cell = ParagraphStyle('Cell', parent=body, fontSize=8.5 if wide else 9, leading=12, spaceAfter=0)
    heading = ParagraphStyle('Title', parent=body, fontName='Montserrat-Regular', fontSize=16, leading=21, spaceAfter=20)
    story = [Paragraph(escape(clean(title)), heading)]

    def blocks(node):
        if node.tag == 'table':
            rows = node.xpath('./thead/tr | ./tbody/tr | ./tr')
            count = max(len(r.xpath('./th | ./td')) for r in rows)
            data = [[Paragraph(('<b>' + inline(c, route) + '</b>') if c.tag == 'th' else inline(c, route), cell) for c in r.xpath('./th | ./td')] for r in rows]
            # Preserve the page's column proportions, with enough width for date labels.
            first = rows[0].xpath('./th | ./td')
            percentages = [re.search(r'(?:^|;)\s*width:\s*([\d.]+)%', c.get('style', '')) for c in first]
            weights = [float(p.group(1)) for p in percentages] if all(percentages) else [1] * count
            col_widths = [width * w / sum(weights) for w in weights]
            table = Table(data, colWidths=col_widths, repeatRows=1 if node.xpath('./thead') else 0, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('NOSPLIT', (0, max(1, len(data) - 2)), (-1, -1)),
                ('LEFTPADDING', (0, 0), (-1, -1), 5),
                ('RIGHTPADDING', (0, 0), (-1, -1), 7),
                ('TOPPADDING', (0, 0), (-1, -1), 7),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('LINEBELOW', (0, 0), (-1, -1), .4, colors.HexColor('#d8d8d8')),
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f5')),
            ]))
            if count == 2 and len(data) <= 10:
                group = [Spacer(1, 10), table, Spacer(1, 16)]
                if len(story) >= 2 and isinstance(story[-2], Paragraph) and 'CURRENT DOCUMENTED EXPOSURE SUMMARY' in story[-2].text:
                    group = story[-2:] + group
                    del story[-2:]
                story.append(KeepTogether(group))
            else:
                story.extend([Spacer(1, 10), table, Spacer(1, 16)])
        elif node.tag in ('p', 'h2', 'h3', 'h4', 'li'):
            if ''.join(node.itertext()).strip():
                markup = inline(node, route)
                if node.tag.startswith('h'):
                    markup = '<b>' + markup + '</b>'
                if node.tag == 'li':
                    parent = node.getparent()
                    marker = str(parent.index(node) + 1) + '. ' if parent is not None and parent.tag == 'ol' else '&#8226; '
                    markup = marker + markup
                fully_bold = (len(node) == 1 and node[0].tag == 'strong'
                              and not (node.text or '').strip() and not (node[0].tail or '').strip())
                is_heading = node.tag.startswith('h') or 'cpi-emphasis-line' in node.get('class', '') or fully_bold
                if 'cpi-emphasis-line' in node.get('class', ''):
                    markup = '<font name="Montserrat-SemiBold">' + re.sub(r'</?b>', '', markup) + '</font>'
                style = ParagraphStyle('Section', parent=body, fontName='Montserrat-SemiBold', keepWithNext=True) if is_heading else body
                paragraph = Paragraph(markup, style)
                if node.xpath('.//a'):
                    group = [paragraph]
                    if story and isinstance(story[-1], Paragraph) and story[-1].style.keepWithNext:
                        group.insert(0, story.pop())
                    story.append(KeepTogether(group))
                else:
                    story.append(paragraph)
        else:
            if node.text and node.text.strip():
                story.append(Paragraph(escape(clean(node.text)), body))
            for child in node:
                if isinstance(child.tag, str):
                    blocks(child)
                if child.tail and child.tail.strip():
                    story.append(Paragraph(escape(clean(child.tail)), body))
    blocks(content)

    def furniture(canvas, doc):
        canvas.saveState()
        canvas.setTitle(title)
        canvas.setAuthor('Central Park Investors')
        canvas.setFont('Montserrat-Regular', 10)
        canvas.setFillColor(colors.HexColor('#333333'))
        canvas.drawString(doc.leftMargin, pagesize[1] - 35, 'C E N T R A L  P A R K  I N V E S T O R S')
        canvas.setFont('Montserrat-Light', 7)
        canvas.drawString(doc.leftMargin, pagesize[1] - 49, 'PRIVATE INVESTMENT AND ASSET MANAGEMENT')
        canvas.setStrokeColor(colors.HexColor('#cccccc'))
        canvas.line(doc.leftMargin, pagesize[1] - 59, pagesize[0] - doc.rightMargin, pagesize[1] - 59)
        canvas.setFont('Montserrat-Light', 7)
        canvas.drawString(doc.leftMargin, 27, 'CONFIDENTIAL SETTLEMENT COMMUNICATION')
        canvas.drawRightString(pagesize[0] - doc.rightMargin, 27, str(doc.page))
        canvas.restoreState()
    SimpleDocTemplate(str(output), pagesize=pagesize, leftMargin=.6*inch, rightMargin=.6*inch,
                      topMargin=80, bottomMargin=48).build(story, onFirstPage=furniture, onLaterPages=furniture)

    # Verify complete text and all supporting URLs before replacing any downloads.
    reader = PdfReader(output)
    embedded = set()
    for page in reader.pages:
        for resource in page['/Resources']['/Font'].get_object().values():
            font = resource.get_object()
            name = str(font.get('/BaseFont', ''))
            if 'Montserrat' in name:
                if '/FontFile2' not in font['/FontDescriptor']:
                    raise ValueError(f'{output.name}: Montserrat font is not embedded')
                embedded.add(name.split('+')[-1])
    if not {'Montserrat-Light', 'Montserrat-Regular', 'Montserrat-SemiBold'} <= embedded:
        raise ValueError(f'{output.name}: expected Montserrat weights are missing')
    text = '\n'.join(p.extract_text() or '' for p in reader.pages)
    expected = tokens(' '.join(content.itertext()))
    missing = expected - tokens(text)
    if missing:
        raise ValueError(f'{output.name}: missing content tokens: {dict(missing)}')
    if re.search(r'Prepared\s*:', text, re.I):
        raise ValueError('Prepared-date line remains')
    links = set()
    for page in reader.pages:
        for annot in page.get('/Annots', []):
            action = annot.get_object().get('/A', {})
            if action.get('/URI'):
                links.add(str(action['/URI']))
    expected_links = {urljoin(SITE + route, a.get('href')) for a in content.xpath('.//a[@href]')}
    if expected_links - links:
        raise ValueError(f'{output.name}: missing hyperlinks: {expected_links - links}')
    if any('/pages/cc01' in u or '/pages/o1101' in u for u in links):
        raise ValueError('Old case URL remains')
    print(f'{output.name}: {len(reader.pages)} pages; text and {len(expected_links)} link targets verified')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=ROOT / 'assets/documents')
    args = parser.parse_args()
    register_fonts()
    with TemporaryDirectory(prefix='cpi-pdfs-') as temp:
        staged = []
        for source in sorted((ROOT / 'source/site/cases').rglob('index.html')):
            tree = html.fromstring(source.read_text())
            downloads = tree.xpath('//a[@download]/@href')
            if not downloads:
                continue
            name = Path(unquote(downloads[0])).name
            destination = Path(temp) / name
            build(source, destination)
            staged.append((destination, args.output_dir / name))
        if len(staged) != 8:
            raise ValueError(f'Expected eight case PDFs; found {len(staged)}')
        args.output_dir.mkdir(parents=True, exist_ok=True)
        for source, destination in staged:
            destination.write_bytes(source.read_bytes())


if __name__ == '__main__':
    main()
