# Zhiyuan Chen - Personal Homepage

Single-page academic homepage for `https://chenzhiyuan777.github.io/`, built with
Astro and deployed through GitHub Pages. The visual system follows the current
live `https://yangyichu.github.io/` academic homepage, not its older downloaded
Bootstrap version: Trebuchet MS typography, a white background, `#494e52` body
text, `#224b8d` links, white sticky navigation, and `#00369f` media labels.
The desktop content width is 925px, expanding to 1280px at wide viewports;
project figures are at most 350px wide. The Astro structure is retained so the
existing GitHub Pages workflow and typed content data remain the source of truth.

## Local development

The site requires Node.js 22.12 or newer.

```bash
nvm use
npm ci
npm run dev
```

Build the production site with:

```bash
npm run build
```

The online homepage is `https://chenzhiyuan777.github.io/`. Local `dist/` and
`.astro/` outputs are generated files and remain ignored by Git.

## Updating content

Most public content is stored in [`src/data/profile.ts`](src/data/profile.ts):

- news
- publications and project links
- work and education history
- patents
- competitions and honors

Images live in `public/images/`. Publication media use the template's
left-image/right-description proportions and a shared 16:9 display frame so
source GIFs are shown without cropping.
Set `mediaLabel` on a publication to customize the blue label on its media;
otherwise the label uses the venue and year. Missing figures remain placeholders.
<!-- by cgpt: Keep the CoRL-style overlay as the default publication treatment. -->
Set `mediaLabel: false` to hide a media label when needed. Current publications
use the default upper-left overlay, matching the CoRL 2026 card; use
`mediaLabelPosition: "above"` only when a future dense figure needs a reserved
label strip.
<!-- by cgpt: Publication resource and media handoff for the other editing window. -->
<!-- by cgpt: Keep recent under-review work adjacent to the latest public projects. -->
The featured publication order is PACE, ForeTac, Finder, UCAG-P, ALTER, TIM,
AEI, JCEM, NAMRC, and CIN.
<!-- by cgpt: Select a source MP4 for PACE and retain seven approved WebP previews. -->
PACE uses its reviewed MP4; seven other previews use lossless animated WebP files.
Finder and CIN use static PNG figures.
<!-- by cgpt: Keep the other seven original GIF reference timelines unchanged. -->
The seven other WebP previews retain every displayed pixel, the dimensions, playback speed,
and complete timeline of the approved GIFs. Repeated identical frames may share
one encoded frame with their original combined display duration. The GIF originals,
smaller `_lite` candidates, generation scripts and full pixel proofs remain in the
external local media workspace for comparison. TIM keeps its
View2 and visual-feedback inset, without
burned-in stage or speed labels; its blue page label is `IEEE TIM 2025`.
<!-- by cgpt: Preserve original video bytes and the sharp figure without a large animated image. -->
PACE selects `public/videos/pace/pace-overview-4x-master-hd-1280x720-by-cgpt.mp4`
through `video` in `profile.ts`, with the original-Figure-1 HD cover in `image`
and `videoFigureSeconds: 4`. The MP4 is a byte-identical copy of the reviewed
1280×720 montage: 30 fps, 635 frames, 21.167 seconds, 2.41 MB, already fast-start.
It adds no encoding loss; its existing H.264 compression is not pixel-lossless.
The 0.31 MB figure comes directly from the original 4076×2508 image. Together
they require 2.72 MB, about 91% less than the rejected 30.56 MB WebP/cover pair.
The original figure overlays the video for the first four seconds of each loop,
using media time rather than a timer. No player controls are displayed.
`src/scripts/publication-video-by-cgpt.ts` starts muted playback within 100px
of the viewport and pauses it outside that area or when the document is hidden.
Failed loading or initially blocked autoplay retains the figure. Without JavaScript,
the original MP4 plays directly with its native figure introduction.
The earlier 480px WebP/cover pair remains in `public/videos/pace` for switching.
The rejected 1280px animated WebP remains unchanged in the local material library
and `.git/local-backups/private-files-by-cgpt/pace-hd-webp-20261010-by-cgpt/`,
so it is excluded from publication. Generation scripts, original sources and
pixel proofs stay in the local PACE material folder. No previous file is overwritten.
<!-- by cgpt: All Video entries now open author-provided YouTube destinations. -->
TIM and AEI Video links open the author-provided YouTube videos. JCEM and NAMRC
each have a single Video link that opens their respective YouTube playlist
directly. NAMRC's earlier two-video chooser is no longer part of the page.
Paper links use the verified publisher DOIs. Resource links
appear directly below the authors, following the live reference homepage.
<!-- by cgpt: Covers prevent large below-screen animations from loading during refresh. -->
Each WebP entry sets `imagePoster` to a lossless full-resolution first-frame
cover. `src/scripts/publication-motion-by-cgpt.ts` loads the animation when it is
within 100px of the viewport, then replaces the cover after loading succeeds.
The cover stays visible on failure. Without JavaScript, the animation is rendered
directly. Both states keep the existing frame and upper-left blue label.
PACE has Project and Paper entries, but Paper is explicitly marked Coming soon
until a public URL is supplied; its project page currently uses `#` for that link.
To activate it, replace the Paper entry's `note` with `href` in `profile.ts`.
<!-- by cgpt: Publication classifications, summaries, and media provenance. -->
The displayed publications each include a one-sentence research summary.
`venueBadge` displays the author's requested classifications: CoRL as
`Top Conference`, TIM and AEI as `Top Journal`, JCEM as `Q1`, and NAMRC as `Q3`.
CIN uses the static `public/images/publications/cin-figure12-ab-by-cgpt.png`,
extracted directly from Figure 12(a)(b) on page 13 of the published CC BY paper
([Feng et al., 2020](https://doi.org/10.1155/2020/7179647)). Its complete author
list follows the original paper, including the spelling `Zhi-Yuan Chen`.
The earlier Chinese CT paper is omitted from the homepage selection; its local
source material is retained.
<!-- by cgpt: ALTER Project source and verified GIF provenance. -->
ALTER's Project link is [the project homepage](https://alter-vla.github.io/ALTER-vla/),
extracted from page 1 of `个人主页/alter/mobicom27-paper415.pdf` in the external
`/home/chenzhiyuan/Documents/personalPAGE` material workspace.
Its comparison preview uses the project's official real-robot
[pi0.5 obstacle video](https://alter-vla.github.io/ALTER-vla/videos/pi05-board.mp4)
and [ALTER obstacle video](https://alter-vla.github.io/ALTER-vla/videos/alter-board.mp4).
Both views are preserved at the original speed and aligned at board insertion:
the pi0.5 clip shows the bowl tipping, while ALTER lifts the block over the board
and places it in the bowl. The clips begin at 3.233/3.733 s and end at
5.733/9.433 s, respectively; their final frames are held for comparison.
The 640×480 source animation lasts 6.7 s. This demonstrates the response to an obstacle,
not a wall-clock latency comparison. The earlier LIBERO GIF remains available
locally for reference. Its Paper entry remains non-clickable because no public
paper link has been supplied. The visible author line is `Co-author`.
Under-review entries do not receive accepted-venue badges. ForeTac uses a
16-second animation made from the supplied presentation's 0–3 s segment followed by
12–25 s; its Project URL is extracted from the manuscript and its Paper entry
remains pending. Its author line currently shows the known first author and a
pending co-author placeholder until the complete list is supplied.
Publication media labels use the CoRL-style upper-left overlay; the source image
dimensions affect only `object-fit: contain` letterboxing inside the fixed 16:9
frame, not the label's frame-relative position.
<!-- by cgpt: Patent dates and bilingual title conventions. -->
Patents are sorted automatically by grant/publication date, newest first.
Each entry displays an English title above the smaller original Chinese title,
followed by the patent/application number. The six public Tsinghua patent entries link
to CNKI's public result page with the Chinese title, `陈志远`, and `清华大学` in the
ordinary keyword query. This is not the same as CNKI's fielded advanced-search AND
query: those field selections are stored in the current browser session. Unverified or
not-yet-published records therefore remain non-clickable rather than pointing to an
ambiguous result set. The two flowerpot records use their verified Google Patents pages.
The date column precedes status;
on mobile, the bilingual title spans the row and date/status appear beneath it.
Dates and full Chinese titles follow the original patent records. The published
smartphone steel-plate entry links its published application record while retaining
the number listed in the CV.
The browser title is `Zhiyuan`; the navigation's leftmost brand is the plain
text `Homepage`, matching the live reference. The favicon and browser tab icon
are derived from the currently selected avatar via
`public/favicon.ico` and the multi-size PNGs. Chrome's site-information button
at the far left of an address bar is browser UI and cannot be changed by HTML.

<!-- by cgpt: Activate the user-approved square portrait and retain the old avatar. -->
The current profile photo is `public/images/profile-lab-portrait-by-cgpt.webp`
(960 x 960). The earlier `public/images/profile-with-robot-final.webp`
(960 x 840) remains beside it for switching, as requested by the user.
The source photo, full generation prompt and export script are documented in
`/home/chenzhiyuan/Documents/personalPAGE/midocx/media/avatar/README.md`.
The sidebar
uses a circular frame and `object-fit: contain` to keep the person and robotic
arm visible. The sidebar, Person metadata and all browser icon versions share
`src/data/avatarByCgpt.ts` and are synchronized by the shell script.

<!-- by cgpt: Switch the portrait and all browser icons together. -->
```bash
bash public/images/switch-avatar-by-cgpt.sh new
bash public/images/switch-avatar-by-cgpt.sh old
```

The executable script is beside both avatars in `public/images/`, as explicitly
approved by the user. Both portraits and this switch script are exceptions to
the used-assets-only rule. The script can run by absolute path from any directory.
Every avatar change must also
update its corresponding browser icons using this script. It accepts a
photograph's filename from the website's `public/images/` directory. Each switch generates
32/180 PNG icons and ICO sizes 16/32/48/64/128/180, updates the selected image,
actual dimensions and content hash, and checks/builds Astro to refresh the local
static preview. It supports `--dry-run` and `--no-build`; it never commits or pushes.
Requirements: Bash, Python 3, ImageMagick (`convert`/`identify`), `flock`, installed
Astro dependencies and Node >=22.12 for a build. A compatible already cached Node
is supported; no global installation occurs. Original portraits stay unchanged.
Outputs, rollback backups, current archives and operation records stay under
`personalPAGE/midocx/`. Failed installation restores the previous file bundle.

## Content still needed

- Public paper link for PACE
- Public role/team wording for Xiaomi
- Google Scholar or other academic profile links
- A public CV with phone number, date of birth, and other private fields removed

The source resume is intentionally ignored by Git and is not deployed.

The footer retains the required attribution link for the free Developer theme
from Xiaoying Riley / 3rd Wave Media. The template's original contact form,
identity data, private files, RSS feed, GitHub activity feed, and calendar are
not copied into this site.

## Deployment

Pushing `main` triggers `.github/workflows/deploy.yml`. In the repository
settings, GitHub Pages should use **GitHub Actions** as its source.

## Maintenance and media boundary — by cgpt

The only website maintenance repository is
`/home/chenzhiyuan/Documents/chenzhiyuan777.github.io`.
This repository tracks the Astro source, necessary build/deployment configuration,
and resources actually used by the website. `node_modules/`, `dist/`, and `.astro/`
are generated local build files and stay ignored.
<!-- by cgpt: Honor the user's explicit old/new PACE coexistence requirement. -->
The previous PACE animation and cover are retained alternatives, alongside the
two switchable avatars and their maintenance script. Do not remove these files
as unused-resource cleanup; other intermediate media stay in the local library.

The separate `/home/chenzhiyuan/Documents/personalPAGE` workspace stores source
materials and intermediate exports. Each publication's final reviewed image,
other candidates, scripts and generation README are under
`midocx/media/papers/<paper>/`; avatar material is under `midocx/media/avatar/`.
The published-assets manifest records the copied final files and SHA256 values.
Its old Astro project is retained as a local historical snapshot under
`midocx/archive/site-snapshot-20261010-by-cgpt/` and is not a maintenance entry.
Media builders write only to their own local output directories; publishing
a reviewed asset requires explicitly copying it into this repository's `public/`.
Local operation records stay in the material workspace's `midocx/` and are not pushed.

<!-- by cgpt: Keep private files and historical Git backups local. -->
Files that should not be uploaded belong in the local staging/archive area
`.git/local-backups/`. Git history backups stay there; existing source materials,
media exports and operation records remain in the external `personalPAGE/midocx/`
workspace. Neither location is part of published repository contents. The local
archive branch is for review only; ordinary pushes publish only `main`.
