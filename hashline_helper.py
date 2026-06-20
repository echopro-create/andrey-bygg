#!/usr/bin/env python3
import sys
import hashlib

def get_line_hash(line_content: str) -> str:
    # Use MD5 hash of the line content (stripped of trailing whitespaces/newlines for stability)
    content = line_content.rstrip('\r\n')
    hasher = hashlib.md5(content.encode('utf-8'))
    return hasher.hexdigest()[:2]

def main():
    if len(sys.argv) < 2:
        print("Usage: hashline_helper.py <file_path>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for idx, line in enumerate(lines, 1):
            line_hash = get_line_hash(line)
            # Print format: 123:a3|line_content
            # Note: line already contains its newline character(s)
            sys.stdout.write(f"{idx}:{line_hash}|{line}")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
