# AGENTS.md

Personal blog of Kevin Zheng. Jekyll 3.10 (via the `github-pages` gem) with the
`minima` theme underneath custom layouts. This repo is the source; the built
output in `_site/` is its own git checkout of `kev-zheng/kev-zheng.github.io`
and is pushed as-is to GitHub Pages.

## Build

Homebrew `ruby@3.3` is keg-only, so prefix every command with its bin dir.

```sh
export PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH
bundle exec jekyll build                       # -> _site/
bundle exec jekyll serve --destination /tmp/kevblog-preview   # local preview
```

This file is listed under `exclude:` in `_config.yml` because it contains
Liquid examples that Jekyll would otherwise try to execute. Keep it there.

Never run `jekyll serve` into `_site/`: serve rewrites `site.url` to
`http://localhost:4000` and that would be committed to the deploy repo.

## Workflow: new picture-oriented post

1. **Kevin points at a folder of photos** (typically a Darktable export under
   `~/Pictures/Darktable/<date>_<name>/`).
2. **Only use photos with human-legible names.** Kevin renames the keepers to
   something descriptive. Files still carrying the camera/export pattern
   (`20260908_0058.jpg`, `.DNG`, `.xmp`, etc.) are rejects: ignore them.
3. **Create the post** in `_posts/` following the existing convention:
   - Filename: `YYYY-MM-DD-<slug>.markdown`
   - Front matter:
     ```yaml
     ---
     layout: post
     name: YYYY-MM-DD-<slug>
     title:  "<Title> <emoji>"
     date:   YYYY-MM-DD
     categories: photography
     icon: 📸
     ---
     ```
   - Body: optional one-line intro, then every photo inside a `nomarkdown`
     block using the EXIF-overlay include:
     ```
     {::nomarkdown}
     {% include photo.html path="photos/YYYY-MM-DD-<slug>/<file>.jpg" %}
     {:/nomarkdown}
     ```
     `photo.html` reads camera model, aperture and shutter from EXIF, so do not
     strip metadata. Use `image.html` instead for screenshots or non-camera
     images.
4. **Resize and copy the selected photos** into `photos/YYYY-MM-DD-<slug>/`
   (same slug as the post), keeping the human-legible filenames. Camera
   exports are full resolution (~40 MB each); the site convention is 2048 px
   on the long edge, which lands around 600 KB. Use `sips`, which keeps the
   EXIF the overlay needs (verified with the `exifr` gem Jekyll uses):
   ```sh
   SRC=~/Pictures/Darktable/<folder>
   DST=photos/YYYY-MM-DD-<slug>
   mkdir -p "$DST"
   for f in "$SRC"/*.jpg "$SRC"/*.JPG; do
     case "$(basename "$f")" in
       [0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]_[0-9]*) continue ;;  # unnamed reject
     esac
     [ -e "$f" ] || continue
     sips -Z 2048 -s formatOptions 85 "$f" --out "$DST/$(basename "${f%.*}").jpg" >/dev/null
   done
   ```
   Never copy the originals, `.DNG`, or `.xmp` files into the repo.
5. **Confirm the post shows on the home page.** The home grid is generated from
   `site.posts` in `_layouts/home.html`; there is no list to edit by hand in
   `index.md`. Build and check `_site/index.html` contains the new post link.
   A post with `hidden: true` in its front matter is built but left off the
   grid.

Then build, and verify every `photos/...` path referenced in the post exists in
`_site/`.

## Repo map

- `_layouts/`: `base` -> `profile` (two-column shell) -> `home`; posts use `post`.
- `_includes/photo.html` / `image.html`: the only two ways photos are embedded.
- `js/dropdown.js`: Muuri grid + category filter on the home page. Categories
  offered: `travel-stories`, `award-travel`, `tech`, `photography`.
- `assets/custom.css`: all site styling on top of Skeleton CSS.
- `photos/<post-slug>/`: images, committed to git.
