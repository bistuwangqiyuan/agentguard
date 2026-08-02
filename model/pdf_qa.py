import fitz
import os, sys

doc = fitz.open("bp.pdf")
print("pages:", len(doc))
os.makedirs("output/pdf_pages", exist_ok=True)
pages = sys.argv[1:] or range(len(doc))
for i in [int(p) for p in pages]:
    pix = doc[i].get_pixmap(dpi=72)
    pix.save(f"output/pdf_pages/p{i+1:02d}.png")
    print("saved page", i + 1)
