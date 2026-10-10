#!/usr/bin/env bash
# by cgpt: Switch the homepage avatar, Person metadata and browser icons together.
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MATERIAL_ROOT="$(cd "$PROJECT_ROOT/.." && pwd)/personalPAGE"
IMAGES_DIR="$SCRIPT_DIR"
SELECTOR="new"
HAVE_SELECTOR=0
BUILD=1
DRY_RUN=0
INVOCATION="$(printf '%q ' "$0" "$@")"
usage() {
  printf '%s\n' \
    'Usage: bash switch-avatar-by-cgpt.sh [new|old|IMAGE_FILENAME] [--dry-run] [--no-build]' \
    'Default: new. IMAGE_FILENAME must be a photograph in the website public/images directory.' \
    'Updates the avatar, Person metadata, PNG/ICO icons and cache version.' \
    'Rebuilds the local static preview by default. Never commits or pushes.'
}
while (($#)); do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --dry-run) DRY_RUN=1 ;;
    --no-build) BUILD=0 ;;
    --*) printf 'Unknown option: %s\n' "$1" >&2; exit 2 ;;
    *)
      ((HAVE_SELECTOR == 0)) || { printf '%s\n' 'Only one avatar may be selected.' >&2; exit 2; }
      SELECTOR="$1"; HAVE_SELECTOR=1 ;;
  esac
  shift
done
case "$SELECTOR" in
  new) FILENAME="profile-lab-portrait-by-cgpt.webp" ;;
  old) FILENAME="profile-with-robot-final.webp" ;;
  *) FILENAME="$SELECTOR" ;;
esac
[[ "$FILENAME" != */* && "$FILENAME" != *$'\n'* && "$FILENAME" != *$'\r'* ]] ||
  { printf '%s\n' 'Use a filename in the images directory, without path separators.' >&2; exit 2; }
case "$FILENAME" in
  avatar-icon-*|favicon.*|og-image.*) printf '%s\n' 'Select a source portrait, not a generated icon or share image.' >&2; exit 2 ;;
esac
LOWER="$(printf '%s' "$FILENAME" | tr '[:upper:]' '[:lower:]')"
case "$LOWER" in
  *.webp|*.png|*.jpg|*.jpeg) ;;
  *) printf '%s\n' 'Supported source formats: WebP, PNG and JPEG.' >&2; exit 2 ;;
esac
SOURCE="$IMAGES_DIR/$FILENAME"
for dependency in python3 convert identify flock; do
  command -v "$dependency" >/dev/null || { printf 'Missing dependency: %s\n' "$dependency" >&2; exit 1; }
done
[[ -f "$SOURCE" && -r "$SOURCE" ]] || { printf 'Missing/read-protected portrait: %s\n' "$SOURCE" >&2; exit 1; }
python3 - "$SOURCE" "$IMAGES_DIR" <<'PY'
from pathlib import Path
import sys
source,images=map(Path,sys.argv[1:])
if source.resolve().parent != images.resolve():
    raise SystemExit('Portrait must resolve inside this images directory.')
PY
DIMENSIONS="$(convert "$SOURCE[0]" -auto-orient -format '%w %h' info:)"
read -r WIDTH HEIGHT <<< "$DIMENSIONS"
[[ "$WIDTH" =~ ^[1-9][0-9]*$ && "$HEIGHT" =~ ^[1-9][0-9]*$ ]] ||
  { printf '%s\n' 'The source photograph could not be decoded.' >&2; exit 1; }
if ((DRY_RUN)); then
  printf 'by cgpt: Would select %s (%sx%s)\n' "$SOURCE" "$WIDTH" "$HEIGHT"
  printf '%s\n' 'Would generate PNG 32/180 and ICO 16/32/48/64/128/180 from this portrait.'
  printf '%s\n' 'Would update the shared avatar selection, icon hash and local archive.'
  if ((BUILD)); then printf '%s\n' 'Would check/build Astro and refresh the material-workspace static preview.'; fi
  exit 0
fi
if ((BUILD)); then
  [[ -f "$PROJECT_ROOT/node_modules/astro/bin/astro.mjs" ]] ||
    { printf '%s\n' 'Install website dependencies first, or use --no-build.' >&2; exit 1; }
  compatible_node() {
    [[ -x "$1" ]] && "$1" -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=12)?0:1)' 2>/dev/null
  }
  NODE_BIN="$(command -v node || true)"
  if ! compatible_node "$NODE_BIN"; then
    NODE_BIN=""
    for candidate in "$HOME"/.npm/_npx/*/node_modules/node/bin/node; do
      if compatible_node "$candidate"; then NODE_BIN="$candidate"; break; fi
    done
  fi
  [[ -n "$NODE_BIN" ]] || { printf '%s\n' 'Node.js >=22.12 is required, or use --no-build.' >&2; exit 1; }
fi
RUN_PARENT="$MATERIAL_ROOT/midocx/media/avatar/outputs/switch-runs-by-cgpt"
mkdir -p "$RUN_PARENT"
exec 9>"$RUN_PARENT/.lock"
flock -n 9 || { printf '%s\n' 'Another avatar switch is running; retry when it finishes.' >&2; exit 1; }
RUN_DIR="$(mktemp -d "$RUN_PARENT/$(date +%Y%m%d-%H%M%S)-XXXXXX")"
LOG_FILE="$MATERIAL_ROOT/midocx/personalPAGE_代码改动记录_头像同步切换_by_cgpt.md"
printf '\n## %s — by cgpt\n\nInvocation: %s\n\n\140\140\140text\n' "$(date -Is)" "$INVOCATION" >> "$LOG_FILE"
exec > >(tee -a "$LOG_FILE") 2>&1
trap 'status=$?; if ((status)); then printf "!!! FAILED: avatar switch was not completed. Reason: command exited %s; inspect retained run directory %s !!!\n" "$status" "$RUN_DIR"; fi; printf "\140\140\140\n"; exit "$status"' EXIT
run() { printf '+ '; printf '%q ' "$@"; printf '\n'; "$@"; }
printf 'Source: %s (%sx%s)\nRetained outputs: %s\n' "$SOURCE" "$WIDTH" "$HEIGHT" "$RUN_DIR"
# Keep the whole selected image on a white square, matching the sidebar contain fit.
run convert "$SOURCE[0]" -auto-orient -resize 180x180 -background white \
  -gravity center -extent 180x180 -strip "$RUN_DIR/avatar-icon-180.png"
for size in 16 32 48 64 128; do
  run convert "$RUN_DIR/avatar-icon-180.png" -resize "$size"x"$size" \
    -strip "$RUN_DIR/avatar-icon-$size.png"
done
run convert "$RUN_DIR/avatar-icon-16.png" "$RUN_DIR/avatar-icon-32.png" \
  "$RUN_DIR/avatar-icon-48.png" "$RUN_DIR/avatar-icon-64.png" \
  "$RUN_DIR/avatar-icon-128.png" "$RUN_DIR/avatar-icon-180.png" "$RUN_DIR/favicon.ico"
printf '%s\n' '+ python3: validate complete icon bundle; install; update shared selection and material manifest'
python3 - "$SOURCE" "$PROJECT_ROOT" "$RUN_DIR" "$MATERIAL_ROOT" "$WIDTH" "$HEIGHT" <<'PY'
from pathlib import Path
from urllib.parse import quote
import hashlib,json,os,shutil,subprocess,sys
source,root,run,material=map(Path,sys.argv[1:5])
width,height=map(int,sys.argv[5:7])
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def dimensions(path):
    result=subprocess.run(['identify','-format','%wx%h\n',str(path)],check=True,capture_output=True,text=True)
    return [tuple(map(int,line.split('x'))) for line in result.stdout.splitlines()]
for size in (16,32,48,64,128,180):
    assert dimensions(run/f'avatar-icon-{size}.png')==[(size,size)]
assert dimensions(run/'favicon.ico')==[(size,size) for size in (16,32,48,64,128,180)]
source_hash=sha(source)
version_hash=hashlib.sha256()
for path in (source,run/'avatar-icon-32.png',run/'avatar-icon-180.png',run/'favicon.ico'):
    version_hash.update(path.read_bytes())
version=version_hash.hexdigest()[:16]
selection={'src':'/images/'+quote(source.name,safe=''),'width':width,'height':height,'iconVersion':version}
config=run/'avatarByCgpt.ts'
config.write_text('// by cgpt: Updated by public/images/switch-avatar-by-cgpt.sh.\n'
    +'export const avatarByCgpt = '+json.dumps(selection,ensure_ascii=False,indent=2)+' as const;\n\n'
    +'export const avatarImageByCgpt = '+chr(96)+'$'+'{avatarByCgpt.src}?v=$'+'{avatarByCgpt.iconVersion}'+chr(96)+';\n')
assets=[(run/'avatar-icon-32.png',root/'public/images/avatar-icon-32.png'),
        (run/'avatar-icon-180.png',root/'public/images/avatar-icon-180.png'),
        (run/'favicon.ico',root/'public/favicon.ico')]
before=run/'before'
before.mkdir()
for _,target in assets+[(config,root/'src/data/avatarByCgpt.ts')]:
    if target.exists():
        backup=before/target.relative_to(root)
        backup.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(target,backup)
media=material/'midocx/media'
manifest_path=media/'published-assets-manifest-by-cgpt.json'
manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else None
if manifest is not None:
    if Path(manifest['site_repository']).resolve()!=root.resolve():
        raise SystemExit('Material manifest points to another website repository.')
    shutil.copy2(manifest_path,before/'published-assets-manifest-by-cgpt.json')
assert sha(source)==source_hash
def install(origin,target):
    target.parent.mkdir(parents=True,exist_ok=True)
    incoming=target.with_name('.'+target.name+'.incoming-by-cgpt-'+run.name)
    try:
        with incoming.open('xb') as output:output.write(origin.read_bytes())
        os.replace(incoming,target)
    except BaseException:
        incoming.unlink(missing_ok=True)
        raise
published=media/'avatar/outputs/published-by-cgpt'
current=[]
pending=[]
for origin,target in [(source,source)]+assets:
    archive=published/target.name
    pending.append((origin,archive))
    current.append({'source':str(target),'archive':str(archive),'sha256':sha(origin),'bytes':origin.stat().st_size})
if manifest is not None:
    icon_sources={str(target) for _,target in assets}
    alternatives={}
    for row in manifest.get('avatar',[])+manifest.get('avatar_alternatives',[]):
        if row['source'] not in icon_sources and row['source']!=str(source):
            alternatives[row['source']]={**row,'role':'previous-avatar-retained-for-switching-by-cgpt'}
    manifest['avatar']=current
    manifest['avatar_alternatives']=list(alternatives.values())
    manifest['active_avatar_by_cgpt']=selection['src']
    updated=run/'published-assets-manifest-by-cgpt.json'
    updated.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    pending.append((updated,manifest_path))
pending.extend(assets)
pending.append((config,root/'src/data/avatarByCgpt.ts'))
# by cgpt: Roll back every applied file if installation cannot finish as a bundle.
rollback=run/'rollback'
rollback.mkdir()
applied=[]
try:
    for number,(origin,target) in enumerate(pending):
        saved=rollback/str(number) if target.exists() else None
        if saved is not None:shutil.copy2(target,saved)
        install(origin,target)
        applied.append((target,saved))
    assert sha(source)==source_hash
except BaseException:
    for target,saved in reversed(applied):
        if saved is not None:
            install(saved,target)
        else:
            # Remove only a file created by this incomplete script run.
            target.unlink(missing_ok=True)
    print('Installation failed: previous avatar/icon/config/archive bundle restored.',file=sys.stderr)
    raise
report={'by':'cgpt','selection':selection,'source_sha256':source_hash,'assets':current,'run_directory':str(run),'committed':False,'pushed':False}
(run/'result-by-cgpt.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
PY
if ((BUILD)); then
  cd "$PROJECT_ROOT"
  run "$NODE_BIN" "$PROJECT_ROOT/node_modules/astro/bin/astro.mjs" check
  run "$NODE_BIN" "$PROJECT_ROOT/node_modules/astro/bin/astro.mjs" build --outDir "$MATERIAL_ROOT/midocx/runtime/chenzhiyuan777.github.io/dist"
fi
printf '%s\n' 'by cgpt: Avatar, metadata and all browser icons are synchronized.'
if ((BUILD)); then
  printf '%s\n' 'Local preview: http://127.0.0.1:4333/'
else
  printf '%s\n' 'Static preview requires rerunning this script without --no-build.'
fi
printf '%s\n' 'No files were staged, committed or pushed.'
