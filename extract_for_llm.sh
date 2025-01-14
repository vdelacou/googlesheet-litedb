#!/usr/bin/env bash

output_file="./combined_for_llm.txt"

# Clear or create the output file
> "$output_file"

# Make sure you run this with `chmod +x` + `./extract_for_llm.sh`

git ls-files --cached --others --exclude-standard \
  | grep -v -E '\.(jpg|png|heic|pdf|svg|webp|ico|lockb)$' \
   | grep -v '^.\gitignore$' \
  | grep -v '^extract_for_llm\.sh$' \
  | grep -v '^combined_for_llm\.txt$' \
  | while IFS= read -r file; do

      # Safety check: skip directories
      if [[ -d "$file" ]]; then
        continue
      fi

      echo "// Filename: $file" >> "$output_file"
      cat "$file" >> "$output_file"
      echo -e "\n" >> "$output_file"

    done

echo "All relevant files have been combined into $output_file"
