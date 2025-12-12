
import re

file_path = 'tela-user.html'

with open(file_path, 'r') as f:
    content = f.read()

# Regex to find the structure and move action-buttons
# We look for .content containing .value-group containing input, and then .actions containing .action-buttons
# We want to move .action-buttons to be inside .content, after .value-group

# Pattern to match the row structure
# Note: This is a simplified approach. HTML parsing with regex is fragile but can work for consistent structures.
# We will iterate through matches and reconstruct the string.

# Strategy:
# 1. Find all .row.editable-row blocks
# 2. Inside each block, find .action-buttons div
# 3. Remove it from its current location
# 4. Insert it after .value-group div closing tag

# Let's try a more robust approach using BeautifulSoup if available, but standard library is safer.
# Since I can't install packages, I'll use string manipulation with finding indices.

def process_content(html):
    new_html = html
    # Find all occurrences of <div class="row editable-row">
    # We will process them one by one.
    
    # Regex to capture the content of a row
    # We assume standard indentation and structure as seen in read_file
    
    # Pattern:
    # <div class="row editable-row">
    # ...
    # <div class="content">
    # ...
    # <div class="value-group">
    # ...
    # </div>
    # ...
    # <div class="actions"> or <div class="actions-wrapper"> (since I ran sed)
    # ...
    # <div class="action-buttons hidden">...</div>
    # ...
    # </div>
    # </div>
    
    # Because I ran sed, the class is now actions-wrapper in some places? 
    # Wait, the sed command was: sed -i 's|<div class="actions">|<div class="actions-wrapper">|g' tela-user.html
    # So <div class="actions"> became <div class="actions-wrapper">.
    
    # Let's revert that sed change first to be clean, or just handle it.
    # Actually, the sed command might have failed or been partial.
    # Let's just read the file again to be sure.
    
    return html

# Re-reading file to check state after sed
with open(file_path, 'r') as f:
    content = f.read()

# The sed command replaced <div class="actions"> with <div class="actions-wrapper">.
# This might have broken the CSS selectors in tela-user.css which target .actions
# I should probably revert this or update CSS.
# But the goal is to move the buttons.

# Let's use a pattern that captures the action buttons and moves them.

# Regex to find the action buttons block: <div class="action-buttons hidden">...</div>
# And move it to after </div> of value-group.

# Pattern for action buttons:
action_btns_pattern = re.compile(r'(<div class="action-buttons hidden">.*?</div>)', re.DOTALL)

# Pattern for value group closing:
# We need to find the insertion point.
# It's inside <div class="content"> ... <div class="value-group"> ... </div> <-- INSERT HERE

# This is tricky with regex globally.
# Let's iterate over the file line by line or use a state machine approach.

lines = content.split('\n')
new_lines = []
buffer_action_buttons = None
inside_row = False
inside_content = False
inside_actions = False

# This is too complex to do reliably without a parser.
# Let's try to construct the new HTML for a single row and replace it.

# Sample Row:
# <div class="row editable-row">
#     <div class="content">
#         <span class="label">...</span>
#         <div class="value-group">
#             ...
#         </div>
#     </div>
#     <div class="actions-wrapper">
#         <button class="btn-edit">...</button>
#         <div class="action-buttons hidden">...</div>
#     </div>
# </div>

# Desired Row:
# <div class="row editable-row">
#     <div class="content">
#         <span class="label">...</span>
#         <div class="value-group">
#             ...
#         </div>
#         <div class="action-buttons hidden">...</div> <!-- MOVED -->
#     </div>
#     <div class="actions-wrapper">
#         <button class="btn-edit">...</button>
#     </div>
# </div>

# I will use a regex to match the whole row and rearrange groups.
# Regex:
# (<div class="row editable-row">.*?<div class="content">.*?<div class="value-group">.*?</div>)(\s*)(</div>\s*<div class="actions(?:-wrapper)?">.*?)(<div class="action-buttons hidden">.*?</div>)(\s*</div>\s*</div>)

# Explanation:
# Group 1: Start of row, content start, value-group complete.
# Group 2: Whitespace after value-group closing.
# Group 3: Closing of content, start of actions, edit button.
# Group 4: The action buttons div.
# Group 5: Closing of actions, closing of row.

# We want to construct: Group 1 + Group 4 + Group 2 + Group 3 + Group 5 (minus the action buttons in group 3)

# Wait, Group 3 includes the start of actions div.
# If I remove Group 4 from its place, I need to make sure I don't leave a hole or malformed HTML.

pattern = re.compile(
    r'(<div class="row editable-row">.*?<div class="content">.*?<div class="value-group">.*?</div>)(\s*)(</div>\s*<div class="actions(?:-wrapper)?">.*?)(<div class="action-buttons hidden">.*?</div>)(\s*</div>\s*</div>)',
    re.DOTALL
)

def replace_callback(match):
    part1 = match.group(1) # ... value-group"> ... </div>
    part2 = match.group(2) # whitespace
    part3 = match.group(3) # </div> <div class="actions"> ... <button...>
    part4 = match.group(4) # <div class="action-buttons">...</div>
    part5 = match.group(5) # </div> </div>
    
    # New structure:
    # part1 (ends with value-group </div>)
    # part4 (action buttons)
    # part2 (whitespace)
    # part3 (ends with button)
    # part5 (closing divs)
    
    return part1 + '\n' + part4 + part2 + part3 + part5

new_content = pattern.sub(replace_callback, content)

# Also need to fix the class name if I broke it with sed
new_content = new_content.replace('class="actions-wrapper"', 'class="actions"')

with open(file_path, 'w') as f:
    f.write(new_content)
