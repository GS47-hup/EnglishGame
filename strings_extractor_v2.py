import sys
import gzip
import re

def extract_strings(file_path, min_len=4):
    try:
        # Try reading as Gzip first
        try:
            with gzip.open(file_path, 'rb') as f:
                data = f.read()
        except:
            # Fallback to direct read
            with open(file_path, 'rb') as f:
                data = f.read()
        
        # Regex to find sequences of printable characters
        pattern = re.compile(rb'[ -~]{' + str(min_len).encode() + rb',}')
        matches = pattern.findall(data)
        
        for match in matches:
            try:
                text = match.decode('utf-8').strip()
                if text:
                    print(text)
            except:
                pass
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python strings_extractor_v2.py <file_path>")
    else:
        extract_strings(sys.argv[1])
