"""
레거시 PHP 홈페이지의 제품소개 페이지(kor/product/*.html)를
Next.js 에서 렌더링할 콘텐츠 데이터(lib/content/products.ts)로 변환한다.

레거시 마크업이 아래처럼 규칙적이라 블록 단위로 그대로 옮길 수 있다.
  .pd-content
    .type--01  제품소개  → .text-bx 의 문단들
    .db-img               → 제품 구성도 이미지
    .type--02  제품특징  → .information-item (소제목 + 문단/표/불릿)
    .type--03  구축사례  → .case-item li (날짜 + 내용)

사용법:  python scripts/convert-legacy-product.py "<레거시 경로>"
"""

import json
import os
import re
import sys
from html.parser import HTMLParser

VOID_TAGS = {'br', 'img', 'input', 'meta', 'link', 'hr', 'col'}

# 슬러그 ← 레거시 파일명
SLUGS = ['m-core', 'm-cores', 'ets', 'emat', 'micro', 'msys', 'teps']

# 제품 구성도 이미지 (원본 sub.min.css 의 .xxx-db-img background-image)
DB_IMAGES = {
    'm-core': 'db-img.jpg',
    'm-cores': 'mcores-db.jpg',
    'ets': 'ets-db.jpg',
    'emat': 'emat-db.jpg',
    'micro': 'micro-db.jpg',
    'msys': 'mysy-db.jpg',   # 원본 파일명이 mysy 로 되어 있다
    'teps': 'teps-db.jpg',
}

# 화면에 노출할 제품명 (원본 arr_data.php 의 $nav_2_N)
PRODUCT_NAMES = {
    'm-core': 'M-CORE',
    'm-cores': 'M-CORES',
    'ets': '전력거래시스템 (ETS)',
    'emat': 'EMAT',
    'micro': '마이크로그리드 최적화시뮬레이터',
    'msys': 'MSYS',
    'teps': 'TEPS',
}


class Node:
    def __init__(self, tag, attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.children = []
        self.parent = None

    @property
    def classes(self):
        return self.attrs.get('class', '').split()

    def append(self, node):
        if isinstance(node, Node):
            node.parent = self
        self.children.append(node)

    def find_all(self, predicate, out=None):
        out = [] if out is None else out
        for child in self.children:
            if isinstance(child, Node):
                if predicate(child):
                    out.append(child)
                child.find_all(predicate, out)
        return out

    def find(self, predicate):
        found = self.find_all(predicate)
        return found[0] if found else None


class Builder(HTMLParser):
    """레거시 HTML 을 최소한의 트리로 만든다. (PHP 블록은 미리 제거해서 넣는다)"""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].append(node)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].append(Node(tag, attrs))

    def handle_endtag(self, tag):
        if tag in VOID_TAGS:
            return
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        if data.strip():
            self.stack[-1].append(data)


def has_class(node, name):
    return name in node.classes


def text_of(node):
    """<br> 은 줄바꿈으로, 나머지 태그는 벗겨서 텍스트만 뽑는다."""
    parts = []

    def walk(current):
        for child in current.children:
            if isinstance(child, str):
                parts.append(child)
            elif child.tag == 'br':
                parts.append('\n')
            else:
                walk(child)

    walk(node)

    text = ''.join(parts)
    # 줄 단위로 공백 정리 (원본의 들여쓰기 제거)
    lines = [re.sub(r'\s+', ' ', line).strip() for line in text.split('\n')]
    return '\n'.join(line for line in lines if line != '').strip()


def strip_php(source):
    """<? ... ?> 블록과 PHP 단축 출력 구문을 제거한다."""
    return re.sub(r'<\?.*?\?>', '', source, flags=re.DOTALL)


def parse_table(node):
    head = [text_of(cell) for cell in node.find_all(lambda n: n.tag == 'th')]
    rows = []

    for row in node.find_all(lambda n: n.tag == 'tr'):
        cells = [text_of(cell) for cell in row.find_all(lambda n: n.tag == 'td')]
        if cells:
            rows.append(cells)

    return {'type': 'table', 'head': head, 'rows': rows}


def parse_blocks(container, skip=()):
    """문단 / 불릿 / 표를 등장 순서대로 블록 배열로 만든다."""
    blocks = []

    for child in container.children:
        if not isinstance(child, Node) or child in skip:
            continue

        if child.tag == 'p' or (child.tag == 'div' and has_class(child, 'dec--03')):
            text = text_of(child)
            if text:
                blocks.append({'type': 'p', 'text': text})

        elif child.tag == 'ul' and has_class(child, 'bullet-bx'):
            items = [text_of(item) for item in child.find_all(lambda n: n.tag == 'li')]
            items = [item for item in items if item]
            if items:
                blocks.append({'type': 'list', 'items': items})

        elif child.tag == 'table':
            blocks.append(parse_table(child))

        elif child.tag == 'div':
            # .flex-box 처럼 한 겹 더 감싼 경우 안쪽을 이어서 훑는다.
            blocks.extend(parse_blocks(child, skip))

    return blocks


def convert(path, slug):
    with open(path, encoding='utf-8') as handle:
        source = strip_php(handle.read())

    builder = Builder()
    builder.feed(source)
    root = builder.root

    content = root.find(lambda n: has_class(n, 'pd-content'))
    if content is None:
        raise SystemExit('%s : .pd-content 를 찾지 못했습니다.' % slug)

    # 상단 배경 이미지 (.xxx-bg)
    hero = root.find(lambda n: n.tag == 'div' and any(c.endswith('-bg') for c in n.classes))
    hero_class = next((c for c in hero.classes if c.endswith('-bg')), None) if hero else None
    hero_image = '/images/sub/%s.jpg' % hero_class if hero_class else None

    # 제품 구성도 (m-core 는 <img>, 나머지는 CSS 배경이라 슬러그로 매핑한다)
    db_image = '/images/sub/product/%s' % DB_IMAGES[slug]

    result = {
        'slug': slug,
        'name': PRODUCT_NAMES[slug],
        'heroImage': hero_image,
        'dbImage': db_image,
        'intro': [],
        'features': [],
        'cases': [],
    }

    # 제품소개
    type01 = content.find(lambda n: has_class(n, 'type--01'))
    if type01 is not None:
        text_box = type01.find(lambda n: has_class(n, 'text-bx'))
        if text_box is not None:
            result['intro'] = parse_blocks(text_box)

    # 제품특징
    type02 = content.find(lambda n: has_class(n, 'type--02'))
    if type02 is not None:
        for item in type02.find_all(lambda n: has_class(n, 'information-item')):
            heading = item.find(lambda n: n.tag == 'p' and 'font-weight-medium' in n.classes)
            title = text_of(heading) if heading is not None else ''
            blocks = parse_blocks(item, skip=(heading,) if heading is not None else ())
            result['features'].append({'title': title, 'blocks': blocks})

    # 구축사례
    type03 = content.find(lambda n: has_class(n, 'type--03'))
    if type03 is not None:
        for item in type03.find_all(lambda n: n.tag == 'li'):
            date = item.find(lambda n: 'date' in n.classes)
            desc = item.find(lambda n: 'dec' in n.classes)
            if date is not None or desc is not None:
                result['cases'].append({
                    'date': text_of(date) if date is not None else '',
                    'desc': text_of(desc) if desc is not None else '',
                })

    return result


def main():
    if len(sys.argv) < 2:
        raise SystemExit('사용법: python scripts/convert-legacy-product.py "<레거시 경로>"')

    legacy_root = sys.argv[1]
    products = []

    for slug in SLUGS:
        path = os.path.join(legacy_root, 'kor', 'product', '%s.html' % slug)
        products.append(convert(path, slug))

    body = json.dumps(products, ensure_ascii=False, indent=2)
    output = '''/**
 * 제품소개 콘텐츠
 *
 * 레거시 kor/product/*.html 를 scripts/convert-legacy-product.py 로 변환한 결과다.
 * 문구를 고칠 때는 이 파일을 직접 수정한다. (스크립트를 다시 돌리면 덮어써진다)
 */
import type { ProductContent } from '@/lib/content/types';

export const PRODUCTS: ProductContent[] = %s;

/** 슬러그로 제품 콘텐츠를 찾는다. */
export function getProduct(slug: string): ProductContent | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
''' % body

    target = os.path.join('lib', 'content', 'products.ts')
    os.makedirs(os.path.dirname(target), exist_ok=True)

    with open(target, 'w', encoding='utf-8') as handle:
        handle.write(output)

    for product in products:
        print('%-10s intro=%d features=%d cases=%d hero=%s db=%s' % (
            product['slug'], len(product['intro']), len(product['features']),
            len(product['cases']), product['heroImage'], product['dbImage']))
    print('\n-> %s' % target)


if __name__ == '__main__':
    main()
