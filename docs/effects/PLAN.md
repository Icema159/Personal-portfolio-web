# Fluid effects implementation

## Baseline — 2026-09-09
- Branch: feat/fluid-effects
- Original commit: 64acb8740bf5f7e358e01b92aa68b3e2c3dccc3e
- Reference: https://www.yannesidibe.com/
- Local: http://127.0.0.1:5173/Personal-portfolio-web/
- Screenshots: baseline/desktop.png (1577×1233), baseline/mobile.png (390×844).
- Mobile capture is viewport-only, not touch-device emulation.
- Existing hero: HTML Antonio heading, CSS-animated PNG knot.
- Existing LiquidCursor: interpolated DOM position, no fluid renderer.
- Existing cursor-hot class does not match CSS cursor-active selector.
- Build passes. Full lint fails on generated .vite/deps files (280 errors); source-only lint checked separately. Build: 500 ms; JS 360.96 kB / gzip 119.52 kB; CSS 42.89 kB / gzip 10.76 kB.
- Browser FPS has NOT been measured. Add a development-only frame sampler at the start of step 2, measure effects disabled before enabling them. Build timing is not rendering performance.
- src/effects/config.js reserves independent disabled switches; wiring belongs to step 2.

## Repeatable visual checks
Use the same viewport and normalized pointer paths on reference and implementation.
1. Cross heading left to right over 3 seconds.
2. Cross back in roughly 0.3 seconds.
3. Circle heading centre for 2 seconds.
4. Stop for 3 seconds; verify decay and original text restoration.
5. Exit heading, then browser content; no stuck input or particles.
6. Scroll hero → projects → about; smoke contrast and preview layering.
7. Resize desktop → 390×844 → desktop; no clipped or duplicated text.
8. Reduced motion / touch / unavailable WebGL: readable static fallback.
9. Menu, project accordion, CV and contact links remain functional.

## Ordered milestones
1. Baseline: screenshots, isolated branch, checks, reserved switches prepared. FPS measurement carried into step 2.
2. One renderer + pointer coordinates + lifecycle + disabled-effects FPS baseline.
3. Stable GPU flow: advection, pressure projection, vorticity, decay.
4. Smoke rendering: density, opacity, dark/light contrast, natural disappearance.
5. Heading texture: font/layout match, localized displacement, HTML fallback.
6. Composite heading and existing knot; actual 3D geometry is separate scope.
7. Reduced motion, touch, visibility pause, quality scaling, disposal.
8. Reference comparison and final build/lint/interaction checks.

Work one milestone at a time. Reuse these notes and captures. Run checks once per meaningful change; repeat only for new failures or edits. No new framework, deployment or unrelated redesign.

## Step 2 completed
- Replaced empty translated cursor div with one transparent WebGL2 canvas.
- Added runtime ownership, one cancellable RAF loop, pointer screen/hero coordinates and per-frame hero bounds (including scroll transforms).
- Added resize/DPR cap, live motion/pointer preference handling, visibility pause, pointer exit reset, unavailable/lost-context fallback and StrictMode-safe cleanup.
- Flags are wired to runtime; both remain disabled. Development-only frame sampling is exposed as canvas data attributes; no visible debugging UI.
- Chrome disabled-effects sample: 181 frames, 60 FPS, p95 frame interval 17.4 ms. This is RAF cadence, not GPU render duration or a guarantee for future fluid passes.
- Browser verified one canvas, WebGL ready, hero centre coordinates ~0.497/0.468 and overHero=true, overHero=false after scrolling. Visual layout remains intact.
- Full lint now ignores generated .vite cache; lint and build pass.
- Next: step 3 GPU simulation passes and their resource disposal. No smoke or distortion is rendered yet.

## Steps 3–4 completed — first visible smoke
- Added WebGL2 RGBA16F ping-pong fields, bilinear advection, velocity injection along pointer segments, curl/vorticity, divergence, 16 pressure iterations, pressure projection and density decay.
- Enabled smoke; heading distortion remains disabled. Simulation longest dimension 384 cells, radius .018, density decay 1/sec. Alpha capped at .42; premultiplied transparent output.
- Shader/target allocation checks fall back to unchanged HTML if unsupported. Textures, framebuffers and programs are disposed on unmount; targets rebuilt on resize.
- Chrome verified visible smoke on dark hero, subtler smoke on lavender work section, disappearance at rest and working DevHub accordion through the canvas.
- Active-effects RAF sample: 180 frames, 60 FPS, p95 17.4 ms. Not a GPU timing benchmark or exhaustive device test.
- Screenshot: baseline/smoke-desktop.png. Build and lint pass. No new packages.
- Remaining later-stage checks: actual touch/reduced-motion/context-loss exercise, sustained pointer-motion performance, reference fidelity tuning.
- Next: step 5 localized heading distortion; use the existing flow rather than another simulation.

## Step 5 completed — localized heading distortion
- Rasterises loaded Antonio glyphs at DOM Range positions, with measured font baseline and 90px padding; uploads a linear-filtered RGBA texture.
- Same fluid velocity field displaces heading sampling locally around pointer (145px falloff, maximum 65px/component); activation fades after pointer exit.
- Original semantic H1 retains layout and accessibility; hidden visually only after successful GPU render. Restored on unsupported context, pause, failure, mobile width or disposal.
- Resize/font changes rebuild texture. Tracks scroll opacity and clips GPU heading behind projects section.
- Chrome verified visible local distortion, restored resting typography against baseline screenshot, 390px HTML fallback and desktop restoration.
- RAF sample: 181 frames, 60 FPS, p95 17.7ms. Build/lint pass.
- Screenshot: baseline/heading-distortion.png. Existing PNG knot remains separate and undeformed (step 6).
- This is the first functional fluid-text version; exact fine marble filaments from reference remain an art-direction refinement, not a claimed pixel-identical recreation.

## Final scope and steps 7–8 — 2026-09-09
- Step 6 intentionally skipped at user's request: retain the approved PNG knot and current visual direction.
- After eight seconds without pointer input, skip fluid simulation passes while keeping the heading aligned with page motion. Resume on new input.
- Two consecutive three-second windows below 45 FPS lower simulation resolution to 256 and pressure iterations to 12. Only one downgrade per mount, avoiding oscillation.
- Preference/visibility changes restore HTML, pause animation and clear stale fluid. Allocation/render errors restore the original heading and hide the canvas.
- Six deterministic lifecycle tests pass: reduced-motion/fine-pointer changes, visibility/StrictMode ownership, context loss/restoration, unavailable WebGL, idle/wake, sustained-low-FPS downgrade. Run npm run test:effects.
- These use mocked media and GPU lifecycle boundaries; they do NOT replace physical touch-device or real GPU-driver failure testing.
- Real Chrome: ~9 seconds of repeated pointer interaction, measured 60 FPS / p95 17.4ms; visible smoke and local distortion, idle mode confirmed. Not a thermal/endurance benchmark.
- Real Chrome viewport 390×844: readable static heading; menu opens and keyboard Tab/Enter navigates to Work; DevHub expands/collapses. Desktop restoration and scroll layering checked. Browser error log empty.
- Existing CV path resolves to a file in public; email link retains mailto target. No mail sent and no external deployment.
- Final build, full lint and six tests pass. Approved appearance retained, including existing type layout and knot.
- Exact reference reproduction is not the acceptance target: user approved the current effects. Remaining device-specific coverage: physical phone/Safari and OS-level reduced-motion toggle.
