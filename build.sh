#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
dist_dir="$project_dir/dist"
package_dir="$dist_dir/peekstacchio"

mkdir -p "$package_dir/contents/code"
cat "$project_dir/src/classes/Area.js" \
    "$project_dir/src/classes/PeekAnimation.js" \
    "$project_dir/src/classes/PeekWindow.js" \
    "$project_dir/src/classes/PeekWorkspace.js" \
    "$project_dir/src/main.js" \
    > "$package_dir/contents/code/main.js"

cp "$project_dir/metadata.json" "$project_dir/README.md" "$project_dir/LICENSE" "$package_dir/"

cd "$package_dir"
rm -f "$dist_dir/peekstacchio.zip"
zip -q "$dist_dir/peekstacchio.zip" metadata.json README.md LICENSE contents/code/main.js
