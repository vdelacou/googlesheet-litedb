#!/usr/bin/env bash

output_file="./combined_for_llm.txt"
# Clear or create the output file
> "$output_file"
git ls-files --cached --others --exclude-standard \
  | grep -v -E '\.(jpg|png|heic|pdf|svg|webp|ico|lockb)$' \
   | grep -v '^.\gitignore$' \
  | grep -v '^llm\.sh$' \
  | grep -v '^combined_for_llm\.txt$' \
  | while IFS= read -r file; do
      if [[ -d "$file" ]]; then
        continue
      fi
      echo "// Filename: $file" >> "$output_file"
      cat "$file" >> "$output_file"
      echo -e "\n" >> "$output_file"
    done