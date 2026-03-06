import zipfile
import re
import json

PPTX = r'e:/ESG AI/Bedmutha Industries Ltd. GHG Emission Scope 1_2_3 DB.pptx'

with zipfile.ZipFile(PPTX) as z:
    # --- Theme colors ---
    theme_xml = z.read('ppt/theme/theme1.xml').decode('utf-8')
    # Extract all srgbClr values
    colors = re.findall(r'<a:srgbClr val="([A-Fa-f0-9]{6})"', theme_xml)
    # Extract font names
    fonts = re.findall(r'typeface="([^"]+)"', theme_xml)

    print("=== THEME COLORS (raw srgbClr values) ===")
    print(json.dumps(list(dict.fromkeys(colors)), indent=2))  # unique, ordered

    print("\n=== THEME FONTS ===")
    print(json.dumps(list(dict.fromkeys(fonts)), indent=2))

    # --- Slide 1 layout ---
    slide1_xml = z.read('ppt/slides/slide1.xml').decode('utf-8')
    # Extract text runs and background
    bg_colors = re.findall(r'<a:solidFill><a:srgbClr val="([A-Fa-f0-9]{6})"', slide1_xml)
    slide_texts = re.findall(r'<a:t>([^<]+)</a:t>', slide1_xml)

    print("\n=== SLIDE 1 BACKGROUND / FILL COLORS ===")
    print(json.dumps(list(dict.fromkeys(bg_colors)), indent=2))

    print("\n=== SLIDE 1 TEXT ELEMENTS ===")
    for t in slide_texts[:30]:
        print(f"  - {t}")

    # Check if there's a slide master
    try:
        master_xml = z.read('ppt/slideMasters/slideMaster1.xml').decode('utf-8')
        master_colors = re.findall(r'<a:srgbClr val="([A-Fa-f0-9]{6})"', master_xml)
        master_bg = re.findall(r'<p:bg>.*?<a:srgbClr val="([A-Fa-f0-9]{6})"', master_xml, re.DOTALL)
        print("\n=== SLIDE MASTER COLORS ===")
        print(json.dumps(list(dict.fromkeys(master_colors))[:15], indent=2))
    except Exception as e:
        print(f"\nNo slide master: {e}")
