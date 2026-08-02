import re
html = open('bp.html', encoding='utf-8').read()
leftover = re.findall(r'\{\{[^}]*\}?\}?', html)
print('leftover placeholders:', leftover[:10] if leftover else 'NONE')
print('size KB:', len(html) // 1024)
print('svg count:', html.count('<svg'))
