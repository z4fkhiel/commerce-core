from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted, PageBreak
from datetime import datetime

files = [
    ('README.md', 'README.md'),
    ('docker-compose.yml', 'docker-compose.yml'),
    ('backend/pom.xml', 'backend/pom.xml'),
    ('backend/Dockerfile', 'backend/Dockerfile'),
    ('frontend/package.json', 'frontend/package.json'),
    ('frontend/vite.config.js', 'frontend/vite.config.js'),
    ('frontend/src/main.jsx', 'frontend/src/main.jsx'),
    ('frontend/src/App.jsx', 'frontend/src/App.jsx'),
    ('backend/src/main/java/com/shop/api/ApiApplication.java', 'backend/src/main/java/com/shop/api/ApiApplication.java'),
    ('backend/src/main/java/com/shop/api/controller/AppController.java', 'backend/src/main/java/com/shop/api/controller/AppController.java'),
    ('backend/src/main/java/com/shop/api/model/Product.java', 'backend/src/main/java/com/shop/api/model/Product.java'),
    ('backend/src/main/java/com/shop/api/model/User.java', 'backend/src/main/java/com/shop/api/model/User.java'),
    ('backend/src/main/java/com/shop/api/repo/ProductRepo.java', 'backend/src/main/java/com/shop/api/repo/ProductRepo.java'),
    ('backend/src/main/java/com/shop/api/repo/UserRepo.java', 'backend/src/main/java/com/shop/api/repo/UserRepo.java'),
    ('.github/modernize/java-upgrade/20260606060948/plan.md', '.github/modernize/java-upgrade/20260606060948/plan.md'),
    ('.github/modernize/java-upgrade/20260606060948/progress.md', '.github/modernize/java-upgrade/20260606060948/progress.md')
]

content = []
for title, path in files:
    try:
        with open(path, 'rb') as f:
            raw = f.read()
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError:
            try:
                text = raw.decode('utf-16')
            except Exception:
                text = raw.decode('latin-1', errors='replace')
    except FileNotFoundError:
        text = f'FILE NOT FOUND: {path}'
    content.append((title, text))

report_path = 'TIENDA_DOCKER_EDITABLE-full-code-report.pdf'
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CustomCode', fontName='Courier', fontSize=8, leading=9, leftIndent=0, rightIndent=0, spaceAfter=12))
styles.add(ParagraphStyle(name='CustomHeading1', parent=styles['Heading1'], spaceAfter=12))
styles.add(ParagraphStyle(name='NormalLeft', parent=styles['Normal'], alignment=TA_LEFT, spaceAfter=12))

story = []
story.append(Paragraph('TIENDA_DOCKER_EDITABLE - Código y Tecnología', styles['Heading1']))
story.append(Paragraph(f'Generado: {datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")}', styles['NormalLeft']))
story.append(Paragraph('Este documento contiene todo el código fuente y las configuraciones usadas en el proyecto, así como el plan de actualización y la tecnología aplicada.', styles['NormalLeft']))
story.append(Spacer(1, 12))

for title, text in content:
    story.append(PageBreak())
    story.append(Paragraph(title, styles['Heading1']))
    story.append(Spacer(1, 6))
    if text.startswith('FILE NOT FOUND'):
        story.append(Paragraph(text, styles['NormalLeft']))
        continue
    story.append(Preformatted(text, styles['Code'], maxLineLength=140))

pdf = SimpleDocTemplate(report_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
pdf.build(story)
print(report_path)
