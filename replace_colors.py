#!/usr/bin/env python3
import os
import glob

color_mappings = {
    '#000000': '#F3EFE7',
    '#0F0F0F': '#DDD2C3',
    '#171717': '#FFFFFF',
    '#FFFFFF': '#1E1E1E',
    '#B8B8B8': '#6E5846',
    '#7A7A7A': '#8A8178',
    '#232323': '#CBB8A0',
    '#2779A7': '#121212'
}

tsx_files = glob.glob('./src/**/*.tsx', recursive=True)
total_replacements = 0

print(f'Found {len(tsx_files)} .tsx files\n')

for file_path in tsx_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        file_replacements = 0
        
        for old_color, new_color in color_mappings.items():
            count = content.count(old_color)
            if count > 0:
                file_replacements += count
                content = content.replace(old_color, new_color)
        
        if file_replacements > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'{os.path.basename(file_path)}: {file_replacements} replacements')
            total_replacements += file_replacements
    
    except Exception as e:
        print(f'Error processing {file_path}: {e}')

print(f'\nTotal replacements: {total_replacements}')
