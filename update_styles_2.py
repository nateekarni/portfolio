
import os

files = [
    r'src/pages/admin/HeroManager.jsx',
    r'src/pages/admin/ContactManager.jsx',
    r'src/pages/admin/AdminLogin.jsx',
    r'src/pages/admin/AboutManager.jsx'
]

replacements = [
    # Common
    (
        'className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700"',
        'className="form-input"'
    ),
    # HeroManager mono
    (
        'className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-mono text-sm text-gray-500"',
        'className="form-input font-mono text-sm text-gray-500"'
    ),
    # AdminLogin 1
    (
        'className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"',
        'className="form-input pl-12 pr-4 text-gray-900 dark:text-white"'
    ),
    # AdminLogin 2 (password with eye icon probably, pr-12)
    (
        'className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"',
        'className="form-input pl-12 pr-12 text-gray-900 dark:text-white"'
    )
]

base_dir = r'c:\Users\natee\Desktop\Projects\portfolio'

for file_path in files:
    full_path = os.path.join(base_dir, file_path)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
        
        if content != new_content:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {file_path}')
        else:
            print(f'No changes in {file_path}')
    else:
        print(f'File not found: {file_path}')
