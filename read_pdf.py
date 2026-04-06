import PyPDF2
import json

def read_pdf():
    try:
        reader = PyPDF2.PdfReader("BUSINESS_RESPONSIBILITY_AND_SUSTAINABILITY_REPORT_FY_2024_25_extracted.pdf")
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(text[:4000]) # First 4000 chars should give me the essence
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    read_pdf()
