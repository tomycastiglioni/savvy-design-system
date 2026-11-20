# Resources content model (proposal v0, for review with Mary)

Builds on `resources-audit.md` and the sitemap in FigJam ("Resources sitemap v2").
Decisions already made: Press stays separate; Lead magnets and Events are their own CMS collections; Product is advisor-only; one listing page per content type; Investment, Announcements and Events are shared by both hubs; Client Blog covers client education; nothing is changed in Webflow yet.

## 1. Principles
1. **One item, one URL, many places.** An item is created once. Tags decide which hubs and listings show it. Shared content is never duplicated.
2. **Tags route, templates don't.** Where something appears is decided by Audience, Content type, Topic and Series. No hand-built strips or static pages.
3. **Structure for answers, freedom for the body.** Fields every article must have (summary, author, dates, FAQs, sources) are fixed and always in the same place, so they can feed structured data. The body is assembled from blocks.
4. **Four dimensions, never mixed.** Today one 20-item category list mixes topic, audience, type and series. The new model keeps each as its own field.

## 2. Collections

| # | Collection | Replaces | Purpose |
|---|---|---|---|
| 1 | **Content** | Blog Posts (647), Q&A Posts (2), parts of static pages | Articles, videos, podcasts, case studies, product posts, announcements |
| 2 | **Events** | About 15 static event pages | Webinars, open houses, recaps |
| 3 | **Lead magnets** | About 60 static guide/landing/thank-you pages | Gated and ungated guides, tools, calculators, reports, advisor campaigns |
| 4 | Authors | Free-text "Written by" | Credibility, author pages, schema |
| 5 | Topics | Mixed category list | Subject tags |
| 6 | Series | Titles only | Recurring programs |
| 7 | Audiences | Two on/off switches | Advisors, Clients |
| 8 | FAQ items | FAQ collection (page switches) | Reusable question/answer pairs |
| 9 | CTAs | Fields copied onto every post | Reusable calls to action |
| 10 | Disclosures | Free-text on each post | Reusable compliance text |

**Out of scope here:** Presses (stays as is), EPD/Builders blog (5 posts, separate site section; to confirm), Advisor Directory collections.

## 3. Tags (the routing fields)

### Audience (multi-select, required)
Advisors, Clients. Selecting both puts the item on both hubs from one entry. Held in an Audiences collection so a third audience can be added later without changing templates.

### Content type (single select, required) on Content

| Type | Hub(s) | Replaces |
|---|---|---|
| Product | Advisors | Savvy Shipped; Hannah's capability stories and Under the hood |
| Case Study | Advisors | "Why Savvy" Q&As; adds video |
| Investment | Both | Global Markets, Portfolio Perspectives, other market updates |
| Announcement | Both | Savvy Announcements |
| Advisor Blog | Advisors (lower) | Advisor Content, advisor-facing Financial Advisor Insights |
| Client Blog | Clients | All client planning, tax, retirement, estate and education posts |

Events and Lead magnets are their own collections, so "Event" and "Guide or Tool" are not values here.

### Format (single select, required)
Article, Video, Podcast, Guide, Report, Calculator or tool, Recap, Demo. Format changes the card (icon, play button, "download"), the default blocks and the schema type. Adding a format adds an option, not a template.

### Topic (multi-select)
Subjects only: Tax, Retirement, Estate and trusts, Financial planning, Investing and markets, Alternatives, Equity compensation, Practice growth, Technology and AI, Independence and transitions, Firm news. Final list to be agreed with Mary.

### Series (single reference, optional)
Global Markets Recap, Portfolio Perspectives, Inside the Markets, Product capability stories, Under the hood, Savvy Shipped (legacy), Why Savvy. Each series gets its own landing section on the listing page.

### Niche (optional, multi-select)
Employer or community niches that are currently categories: P&G Employees, UVA's Economic Insights (pending decision). Keeps them filterable without polluting Topic.

### Display controls
- Featured on Advisors hub (switch) and Featured on Clients hub (switch), with a rank number.
- Announcement banner (switch) and show-until date, for high-visibility announcements.
- Listed on hubs (switch, default on). Off for advisor-specific campaign items that should have a URL but not appear in listings.

## 4. Content (articles and everything article-shaped)

**Fixed fields, in order of the page:**

| Field | Notes |
|---|---|
| Title, slug | |
| SEO title, meta description | |
| Content type, Format, Audience, Topic, Series, Niche | See section 3 |
| Quick answer | 40 to 60 words at the top of the page, for scanning and answer engines |
| Key takeaways | 3 to 5 bullets |
| Hero media | Image, or video link (YouTube, Vimeo, Loom) |
| Published date, Updated date | Both shown |
| Authors | One or more references |
| Reviewed by | Optional reference to an Author |
| Body | Rich text with blocks (section 7) |
| FAQs | References to FAQ items |
| Sources | Title and URL list |
| Related content | References, defaults to same topic |
| Next-step CTA | Reference to a CTA |
| Disclosure | Reference to a Disclosure |
| Canonical URL | Only when it differs |

**Type-specific fields (shown only for that type):**

| Type | Extra fields |
|---|---|
| Product | Product area, series number, demo (Loom or video link), GIFs or screenshots, "Who it's for" |
| Case Study | Customer name, firm size or AUM, 3 to 4 headline metrics, pull quote, video |
| Investment | Period (month or quarter), data file or PDF, chart images |
| Announcement | Press release link, banner switch and end date |

Structured data is generated by the template from these fields (Article, VideoObject, FAQPage, Person, BreadcrumbList). It replaces the seven hand-pasted schema text fields on Blog Posts.

## 5. Events

| Field | Notes |
|---|---|
| Title, slug, summary, description (blocks) | |
| Event format | Webinar, In person, Open house, Recap-only |
| Start and end date/time, time zone | Upcoming or past is computed, not typed |
| Audience, Topic, Series | Same tags as Content |
| Speakers | Author references |
| **Registration link, General** | Used when the event has one link |
| **Registration link, Advisors** | Optional |
| **Registration link, Clients** | Optional |
| Link labels | Default "Register" |
| Recording or replay link | Shown after the event |
| Recap | Optional reference to a Content item |
| Also a Product event | Switch, shows it in the Product listing as well |
| Featured on hubs, rank | Same as Content |
| FAQs, CTA, Disclosure | References |

**Routing rule for the second link.** Listing cards and hub rails show one link:
- On the Advisors hub: Advisors link, else General.
- On the Clients hub: Clients link, else General.
- Inside the Markets has Advisors and Clients links filled and General empty.

**Open point:** the event page itself has one URL, so it can't know which hub the visitor came from. For two-link events the page would show both, clearly labeled ("Advisors register" and "Clients register"). The alternative is two event entries for Inside the Markets. Needs Mary's call.

Savvy Intelligence Open House: audience Advisors, "Also a Product event" on, so it appears in the Events listing and in a strip on the Product listing.

## 6. Lead magnets

| Field | Notes |
|---|---|
| Title, slug, summary, cover image | |
| Format | Guide, E-book, Checklist, Template, Report, Calculator or tool, Webinar replay |
| Audience, Topic | |
| Gated | Switch |
| Form | HubSpot form ID |
| Delivery | File, or link, or embedded tool |
| Thank-you message and next-step CTA | |
| Calculator embed | For tools |
| Body (blocks), FAQs, Disclosure | |
| Advisor | Optional reference to an advisor, for advisor campaigns |
| Campaign tracking | UTM or campaign name |
| Listed on hubs | Switch. Off for one-off advisor campaigns |
| Featured on hubs, rank | |

The advisor consult, event and `/go/...` pages become Lead magnets with the Advisor reference filled and Listed on hubs off. They keep their own URL and stay out of the Guides and Tools listing.

## 7. Modular blocks (open decision)

Webflow has no native block builder, so there are three ways to give editors modular layouts:

| Option | How | Trade-off |
|---|---|---|
| **A. Components in rich text** | Editors insert predefined components (video, callout, table, stat row, CTA, download) into the body | Most editor freedom. Depends on the rich text component support in the Webflow plan and build |
| **B. Fixed optional slots** | Fields such as Video, Downloads, Callout, each shown only when filled | Simplest and safest, but the order is fixed |
| **C. Blocks collection** | A Blocks collection referenced in order | Most structured, heaviest to edit, reference limits apply |

**Recommendation:** B for the structural AEO fields in section 4 (so they are always in the same place), plus A for the body. To be checked with whoever builds in Webflow before Phase 2.

**Block library v0:** text, image, gallery, video, GIF or demo, audio, callout, key stat row, table, quote, comparison, step list, download, calculator embed, CTA, FAQ group, sources, related content.

## 8. Routing rules

| Surface | Query |
|---|---|
| Resources hub | Top announcement, plus a pointer to each audience hub |
| Advisors hub | Featured on Advisors hub; then one rail per type: Product, Case Study, Investment, Announcement, Event, Advisor Blog (last, 3 items, no featured slot) |
| Clients hub | Featured on Clients hub; then rails: Investment, Announcement, Client Blog, Event, Guides and Tools |
| Type listing page | Items of that type, optional Audience filter, plus Topic, Format and Series filters |
| Series section | Items of that Series |
| Related content | Same Topic, then same Series |
| Announcement banner | Announcements with banner on and end date in the future |

Shared items appear on a hub when Audience contains that hub's audience. The item URL is the same on both.

## 9. URLs (to confirm)

| Page | Proposed | Today |
|---|---|---|
| Resources hub | `/resources` | Client resources |
| Advisors hub | `/advisors/resources` | Same |
| Clients hub | `/clients/resources` | `/resources` (needs a redirect) |
| Listing pages | `/resources/{type}` | `/blog`, `/category/{slug}`, `/events`, `/press` |
| Content items | `/resources/{slug}` | `/blog-posts/{slug}` (267 live URLs need redirects) |
| Events | `/events/{slug}` | Static pages in three folders |
| Lead magnets | `/guides/{slug}` | Static pages, `/thank-you/*`, `/go/*` |

A Webflow collection has one URL prefix, so content type cannot be in the item URL. Static listing pages share the `/resources/` folder with the CMS items, so listing slugs need reserving.

## 10. Migration map

| From | To |
|---|---|
| Savvy Announcements (12 live) | Content, Announcement |
| Advisor Content (16) | Content, Advisor Blog |
| Savvy Shipped (5) | Content, Product, series Savvy Shipped |
| Global Markets Update (39) | Content, Investment, series Global Markets Recap |
| Investment Management, Portfolio Perspectives (10) | Content, Investment, series Portfolio Perspectives, audience both |
| UVA's Economic Insights (60) | Content, Client Blog or Investment (to decide), niche UVA |
| Financial Planning, Retirement, Tax, Trust & Estate, Portfolio Management, Alternatives, Foundations, Financial Advisor Insights (about 140) | Content, Client Blog, mapped to Topic |
| P&G Employees (5) | Content, Client Blog, niche P&G |
| Q&A Posts (2) | Content, Case Study |
| Static event pages (about 15) | Events |
| Static guides, calculators and thank-you pages (about 25) | Lead magnets |
| Advisor consult and campaign pages (about 30) | Lead magnets, unlisted |
| 380 draft blog items | Archive; the 111 press-link drafts check against Presses first |

## 11. Open decisions for Mary
1. Two-link events: show both labeled links on the event page, or two event entries?
2. Block approach (section 7): confirm with the Webflow build.
3. Topic list: the 11 suggested topics need her sign-off.
4. UVA's Economic Insights (60 posts): Investment, Client Blog, or retire?
5. Hub URLs: move the client hub to `/clients/resources`, and redirect `/blog-posts/*` to `/resources/*`, or keep existing URLs?
6. Should Advisor Blog and Client Blog stay as two types, or become one type with an Audience tag?
7. Do Authors need advisor-style pages, and are credentials (CFP, CPWA) a field?
