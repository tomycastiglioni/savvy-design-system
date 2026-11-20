# Savvy Resources: content inventory & audit (v0)

Sources: Webflow CMS (site "Savvy", read 2026-11-20), 320 Webflow pages, live fetches of /advisors/blog, /advisors/resources, /blog-posts/crm-for-financial-advisors, /press, /events.
/blog was read for pages 1 to 5 of 24 only (see section 3); the CMS pull covers the rest.
Row-level data: `blog-posts-inventory.csv` (647 posts).

## 1. CMS collections that matter

| Collection | Items | Used for | Notes |
|---|---|---|---|
| Blog Posts | 647 (267 live, 380 draft) | Everything: client education, market updates, announcements, advisor content, product posts | One collection, one template (`/blog-posts/{slug}`) |
| Blog Category Filters | 20 (4 draft) | Categories; one required "Main" + required multi-ref "Additional" | Mixes topic, audience, series and type in one flat list |
| Presses | 255 | /press (outbound links) | Separate collection, no detail page content |
| Q&A Posts | 2 | "Why Savvy" advisor Q&As at `/qa/{slug}` | Own template; metrics/quotes as numbered text fields |
| EPD Blog Posts | 5 | Builders/engineering blog, `/builders-at-savvy` | Near-copy of Blog Posts schema, Option field for category |
| FAQ | n/a | Site FAQs, one boolean per page ("is for homepage/clients/advisors/services/intelligence") | Audience routing by booleans |
| Global Data | 1 | AUM, advisor count, etc. | Good pattern: single source of truth for stats |
| Events | **none** | n/a | See 2 |

## 2. Findings

### Structure
1. **Events are not a CMS collection.** Each is a static page (`/events/*`, `/advisors-events/*`, `/thank-you/*replay`), roughly 15 event/consult/dinner/webinar pages. No dates on the /events grid, no upcoming/past split, one card links to `#`, two link to replay thank-you pages.
2. **Lead-gen is static one-off pages.** About 60 static pages are guides, playbooks, calculators, advisor landing pages (`/go/...`, `*-consult`, `*-event-*`, `/lp/...`) and their `/thank-you/*` twins. This is the "no static one-off pages" problem in the brief, and the migration list is long.
3. **Inside the Markets lives on 3 static pages**: `/advisors/inside-the-markets` (Q3 2026), `/events/inside-the-markets-clients` (Q4 2026), `/events/q2-2026-inside-the-markets`. There are separate advisor/client pages today, i.e. the dual-link problem is solved by duplicating pages.
4. **Series have no entity.** Portfolio Perspectives posts are filed under "Investment Management" and flagged advisor-only. Global Markets Recap posts are filed under "Global Markets Update" and flagged client-only. Both are meant to be shared content. Nothing identifies a series except the title text.

### Audience routing
5. Audience = two booleans on posts (`client-facing-content`, `advisor-facing-content`), not a tag.
   Live posts: 227 client only, 36 advisor only, **2 both**, 2 neither. The brief's "shared" series (Global Markets, Portfolio Perspectives) are each tagged to one side only today.
6. The advisor hub's sections are hand-curated blocks with their own "Read more" links, several pointing to the wrong place (Why Savvy, Portfolio Perspectives and Savvy Shipped all link to `/events`; Announcements links to `/blog`). Section label typo: "Savvy Anouncements".
7. Advisor hub "Insights" tiles (calculator, e-book, guides) link straight to gated `/thank-you/*` paths, i.e. past the form.

### Taxonomy
8. The 20 categories mix four dimensions: topic (Tax Strategy, Retirement Planning), audience/niche (P&G Employees, UVA's Economic Insights, Sharpe Insights), type (Savvy Announcements, Savvy Shipped, Advisor Content) and series (Global Markets Update). Required "Main" + required "Additional" on every post means every live post carries a duplicate main category.
9. Live posts by main category: UVA's Economic Insights 60, Financial Planning 41, Global Markets Update 39, Financial Advisor Insights 27, Tax Strategy 17, Retirement Planning 17, Advisor Content 16, Investment Management 12, Savvy Announcements 12, Trust & Estate 8, Savvy Shipped 5, P&G 5, other 8.
10. **A content type the brief doesn't name:** about 140 live posts are evergreen client education (planning, retirement, tax, estate). This is the largest body of content and it needs a home in the model (suggest "Client education" or "Learn").

### Volume and health
11. 380 of 647 blog items are drafts. 111 of those have a press link, i.e. historical press items parked as drafts, apparently superseded by the Presses collection (255 items). Needs confirmation before archiving. Draft dates run 2020 to Jul 2026.
12. Live blog posts by year: 2022: 1, 2023: 5, 2024: 16, 2025: 131, 2026: 114. Authors are free-text (`written-by`), no author collection, so no author pages/bio entity, no credentials field. Top authors: Joshua Barone 33, Anshul Sharma 27, Robert Barone 27, Michael McCarthy 25.
13. Press: 100 live cards on one page, no filters, no pagination, no categories. Outlet shown only by logo. The newest item is Sep 9, 2026 (Series C).
14. Product: Savvy Shipped = 5 posts (Mar to Jun 2026). Nothing after Jun 24, 2026. Category exists but no listing page of its own, only a hub strip.
15. Case studies ("Why Savvy"): 2 Q&As. No dates, no video. Template uses numbered fields (Metric #1 to 4, Quote #1 to 4).

### Article page (sample: CRM for Financial Advisors)
16. **Has:** category tag, byline and date, 8 H2s with H3s, metrics table, numbered citations, "Works Cited", "Key Takeaways", related articles (3), 5 "Read More" links, many CTAs (booking widget, "Contact a Savvy advisor", "Schedule a call", author box).
17. **Missing:** table of contents, updated date, visible FAQ answers (only 3 unanswered "Related questions", 3 empty "Related topics" blocks), breadcrumbs, working share links (all `#` in the fetch), author credentials beyond a bio.
18. **Content bugs:** `/blog-posts/SEO-for-financial-advisors` (uppercase) in the Read More vs lowercase in the listing; "…in 2025." link text for a 2026 URL; stray `'` in an H3; `utm_source=chatgpt.com` in a source link; Related Articles are three Portfolio Perspectives posts (not topically related); nav links Savvy Intelligence to the legacy page on this template.
19. **CMS gaps:** Blog Posts has 7 separate plain-text schema fields (BlogPosting, HowTo, FAQPage, Breadcrumbs, WebSite, Person, Organization) pasted by hand. Only 57 of 267 live posts have FAQ schema filled. Related questions/articles are numbered fields (#1 to #3) rather than references. The advisor-bio/Calendly/HubSpot fields are copied onto each post (151 live posts have a HubSpot form ID).
20. One rich-text body field = no modular components (no video, callout, table, calculator, download or CTA blocks as data).

## 3. Client side: /resources and /blog

Coverage: /resources in full. /blog pages 1 to 5 of 24 (the site's own count; the pagination param is `?3142846f_page=N`). Pages 6 to 24 were not read, but the CMS tally above covers them.

### /resources (client hub)
- Five stacked strips, each "H3 + Read more": Press (3), Blog (3), Resources for Advisors (3), Insights (5), Events (5). No filters, tabs or featured slot.
- **The client hub contains an advisor strip** ("Resources for Advisors": the CRM, LinkedIn and Email Marketing articles). Audience separation is not enforced here.
- The Insights strip is the same five tiles as on the advisor hub (calculator, e-book, planning guide, 7 steps, tax guide), title only, no date or format label. Events cards are title only, no dates, and one has `href="#"`.
- The Blog strip's 3 posts are the 3 newest (CRT vs GRAT, Portfolio Perspectives Nov 2026, Biggest Mistakes Exiting), so it is chronological, not curated.

### /blog (client listing)
- Hero filter list of 13 categories (links to `/category/{slug}`), then about 10 hand-built category strips (Announcements, Global Markets Update, Financial Advisor Insights, Retirement, Trust & Estate, Portfolio Management, Financial Planning, Tax Strategy, Foundations & Endowments, Savvy Portfolio Perspectives), then a 12-per-page paginated feed (24 pages), then an **Advisor Content** strip with 12 cards.
- **Every post can appear up to three times on one page** (strip, feed, advisor strip), and the feed repeats the same strips on every page of pagination.
- The `/blog` page is not audience-gated. The advisor-flagged Portfolio Perspectives and the advisor Savvy Shipped posts appear in the client feed. The audience flags do not control what shows where. That contradicts the CMS flags, so the CMS audience booleans are effectively unused for routing. Needs confirmation with whoever built the Webflow filters.
- Categories shown on feed cards: Portfolio Perspectives is labelled "Investment Management", and "Savvy Shipped" appears as a label with no filter.
- Cards: thumbnail, title, author, date. Feed cards add a category label. No excerpt, read time, content-type or format badge.
- Authors are mostly advisors (CFP®/CPWA® credentials appear in the byline text, not a field). 30+ distinct bylines on 60 feed posts.
- "P&G Employees" is a filter but had no posts on pages 1 to 5.
- Lead-gen: two form blocks (success/error text only captured), a "Looking for tips as a financial advisor?" promo that sends clients to the advisor content, and a "Book time with one of our Savvy Advisors" image CTA.
- 267 live posts in the CMS vs about 288 slots in 24 pages: roughly consistent, since the feed seems to include every live post.

### Cross-site duplication summary
| Item | /resources | /advisors/resources | /blog | /advisors/blog |
|---|---|---|---|---|
| Press (same 3 items) | yes | yes | no | no |
| Insights tiles (same 5) | yes | yes | no | no |
| Advisor blog posts | 3 | 6 | 12 (strip) | 17 |
| Portfolio Perspectives | via Blog strip | 6 | 6 (strip) + feed | not in advisor blog |
| Announcements | no | 3 | 3 (strip) + feed | no |
| Events | 5 | 2 | n/a | n/a |

## 4. Inventory → proposed model (first pass)

| Today | Count | Proposed type | Audience tag | Notes |
|---|---|---|---|---|
| Savvy Shipped posts | 5 | Product (Product capability story) | Advisors | Hannah's series replaces this |
| Savvy Intelligence Open House (`/advisors-events/…`) | 1 | Event + Product | Advisors | Shown in both listings via tags |
| Portfolio Perspectives | 10 live | Investment (series) | Both | Currently advisor-flagged only |
| Global Markets Recap | 39 live | Investment (series) | Both | Currently client-flagged only |
| UVA's Economic Insights | 60 live | Investment (partner series) | Clients | Decide whether to keep as a series |
| Inside the Markets | 3 static pages | Event with 2nd link | Both | Advisor link on advisor page, client link on client page |
| Savvy Announcements | 12 live | Announcement | per item | |
| Presses | 255 | Press (keep a collection, link-out) | n/a | Not a Resources type in the brief; confirm placement |
| Advisor Content | 16 live | Advisor blog | Advisors | Lower in hierarchy |
| Investment Management (non-PP) | about 2 | review | | |
| Why Savvy Q&As | 2 | Case Study | Advisors | Add video, dates, structured metrics |
| Client education posts | about 140 live | Needs a type ("Client education"?) | Clients | Not in the brief |
| Gated guides/playbooks/calculators | about 25 static pages | Guide / Tool / Report formats | per item | Migrate with the form block |
| Advisor consult/event landing pages | about 30 static pages | Event or Lead-gen program | Clients | See open question 3 |
| Webinar replays (`/thank-you/*replay`) | 2 | Event recap | per item | |

## 5. Open questions for you
1. Where do the ~140 evergreen client-education posts sit in the new IA?
2. Is Press part of Resources, or a company-level page kept separate?
3. The ~30 advisor-specific landing/event pages (`*-consult`, `*-event-*`, `/go/*`): do they become CMS items of a "Lead-gen program" type, or stay outside the Resources system?
4. UVA's Economic Insights (60 posts, client-flagged): is this still an active series?
5. OK to treat the 380 drafts as archive, and the 111 press-link drafts as duplicates of Presses?
6. Do you have per-page analytics (views, form submits) to rank what earns prominence?
