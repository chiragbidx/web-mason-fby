# Changelog
<!--
  Purpose:
  - Track project change history over time.
  - Record date, summary, and key files touched for each change set.
  - Keep entries append-only (do not delete past entries).
-->

## 2024-06-10 AI Image Generator Launched
- Added real working AI image generator to landing page as a section (`components/home/LayoutImageGeneratorSection.tsx`).
- New `/api/generate-image` API route calls OpenAI Images API (DALL·E 3) with user prompt.
- Updated landing composition in `app/page.tsx` for new generator section.
- Improved OpenAI API helper for Edge/Node compatibility.
- Requires `OPENAI_API_KEY` in env for generation.