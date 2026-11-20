# Resources CMS fields (v1, simplified)

Replaces v0. Three main collections hold the content. Three small collections hold things that need their own page or are reused across collections. Everything else (FAQs, CTAs, disclosures, audience, series, format) is a field on the item.

Nothing here has been built in Webflow.

## Collections

| Type | Collection | Purpose |
|---|---|---|
| Main | **Blog** | Every article-shaped item: Product, Case Study, Investment, Announcement, Advisor Blog, Client Blog |
| Main | **Events** | Webinars, open houses, recaps |
| Main | **Lead Magnets** | Guides, e-books, calculators, reports, advisor campaigns |
| Reference | **Content Types** | The 6 blog types. Generates the `/resources/{type}` listing pages. Holds listing intro text, SEO and hub placement |
| Reference | **Topics** | Subject tags (Tax, Retirement, Estate...) |
| Reference | **Series** | Recurring programs (Global Markets Recap, Portfolio Perspectives, Inside the Markets...). Used to filter and group |
| Reference | **People** | Authors and event speakers |

Fields that are NOT collections: Audience (two switches), FAQ, Disclosure. Series is its own reference collection. Blog has no Format field: video, GIF, charts and downloads are components in the body.

## Blog

| Group | Field | Type | Notes |
|---|---|---|---|
| Basics | Name | Text | Title / H1 |
| | Slug | Text | |
| | Subtext | Text | Shown below the headline. Write it as a direct 1 to 2 sentence answer |
| | Hero image | Image | |
| | Thumbnail | Image | Card image |
| Routing | Content type | Reference (one) to Content Types | Required |
| | Topics | Multi-reference to Topics | |
| | Series | Reference (one) to Series | Optional |
| | Show on Advisors hub | Switch | |
| | Show on Clients hub | Switch | Both on = shared item, one entry |
| Display | Featured on Advisors hub | Switch | Pins to the top slot, sorted by date |
| | Featured on Clients hub | Switch | |
| | Highlight until | Date | Highlights the post (banner or top strip on the hubs). Empty = not highlighted. Stops highlighting after this date |
| SEO | Meta title | Text | About 55 characters |
| | Meta description | Text | About 150 characters |
| | Canonical URL | Text | Only if different |
| Credibility | Authors | Multi-reference to People | |
| | Published date | Date | |
| | Updated date | Date | |
| Body | Body | Rich text | With components: video, GIF or demo, charts, callout, table, quote, download, image gallery |
| FAQ | FAQ 1 to 5, question | Text | 5 pairs |
| | FAQ 1 to 5, answer | Text | |
| Sources | Sources | Rich text | List of titles with links |
| Related | Related posts | Multi-reference to Blog | Default is same topic |
| Compliance | Disclosure type | Option | None, Standard, Investment, Testimonial. The legal text lives once in the template |
| Product only | Series number | Number | Shipped no. 5 |
| | Who it's for | Text | |
| Case Study only | Customer name | Text | |
| | Firm size or AUM | Text | |
| | Metric 1 to 3, value | Text | 3 pairs |
| | Metric 1 to 3, label | Text | |
| | Pull quote | Text | |
| | Quote attribution | Text | |
| Investment only | Period | Text | "November 2026" |

Webflow can't hide fields by type, so editors will see the "only" groups on every post. Field groups with help text ("Product posts only") keep that manageable.

## Events

| Field | Type | Notes |
|---|---|---|
| Name, Slug | Text | |
| Show on Advisors hub | Switch | |
| Show on Clients hub | Switch | |
| Featured on Advisors hub, Featured on Clients hub | Switch | |
| Topics | Multi-reference to Topics | |
| Series | Reference (one) to Series | Optional. Added back for Inside the Markets, to confirm |
| Event format | Option | Webinar, In person, Open house |
| Start date and time | Date | Used for sorting and display |
| Event ended | Switch | Editors turn on after the event. Swaps the registration form for the recording form |
| End date and time | Date | |
| Time zone | Option | |
| Location | Text | In-person only |
| Thumbnail, Hero image | Image | |
| Summary | Text | Card text |
| Description | Rich text | |
| Speakers | Multi-reference to People | |
| Registration form | Text | Form embed script or form ID, shown before the event |
| Registration form, advisors | Text | Optional, for events with separate advisor tracking |
| Registration form, clients | Text | Optional, for events with separate client tracking |
| Recording form | Text | Form embed script or ID, shown after the event |
| Recording link | Link | Revealed after the recording form is submitted |
| Also show on Product listing | Switch | Savvy Intelligence Open House |
| FAQ 1 to 3, question and answer | Text | 3 pairs |
| Disclosure type | Option | |
| Meta title, Meta description | Text | |

How the page behaves:
- While Event ended is off it shows the registration form. When it is on it shows the recording form, if one is filled.
- When both the advisors and clients forms are filled (Inside the Markets), the page shows both, labeled. Hub cards can link with `?audience=advisors` or `?audience=clients` so a small script shows only the matching form. Without the script, both are shown.

## Lead Magnets

| Field | Type | Notes |
|---|---|---|
| Name, Slug | Text | |
| Format | Option | Guide, E-book, Checklist, Template, Report, Calculator or tool, Webinar replay |
| Show on Advisors hub | Switch | Both off = not listed anywhere, for one-off advisor campaigns |
| Show on Clients hub | Switch | |
| Topics | Multi-reference to Topics | |
| Cover image | Image | |
| Summary | Text | Card text |
| Description | Rich text | |
| What's inside | Rich text | Bullets |
| Gated | Switch | On = the form comes first, then the resource. Off = no form, the resource is available directly |
| HubSpot form ID | Text | Gated only |
| Download file | File | Shown directly, or after the form when gated |
| Tool link | Link | For calculators |
| Thank-you message | Text | Gated only |
| Advisor | Reference to Advisor Directory | The advisor behind a campaign page, also acts as the author |
| Campaign name | Text | UTM or tracking |
| Featured on Advisors hub, Featured on Clients hub | Switch | |
| FAQ 1 to 3, question and answer | Text | 3 pairs |
| Disclosure type | Option | |
| Meta title, Meta description | Text | |

## Content Types (reference)

| Field | Type | Notes |
|---|---|---|
| Name, Slug | Text | Product, Case Study, Investment... |
| Description | Text | Intro on the listing page |
| Meta title, Meta description | Text | |
| Icon | Image | |
| Shown on Advisors hub | Switch | |
| Shown on Clients hub | Switch | |
| Advisors hub order | Number | Rail order |
| Clients hub order | Number | Rail order |
| Items shown on hub | Number | Advisor Blog gets 3 |

This is what lets editors reorder the hub rails without a designer. Each item also generates its `/resources/{type}` listing page, so a new type is a new item, not a new page.

## Topics (reference)

Name, Slug, Description, Color, Meta title, Meta description, Sort order.

Color is a color field, used for the dot next to the topic name on cards and filters.

## Series (reference)

Name, Slug, Description, Cover image, Meta title, Meta description.

Starting series: Global Markets Recap, Portfolio Perspectives, Inside the Markets, Capability stories, Under the hood, Why Savvy.

## People (reference)

Name, Slug, Role, Credentials (CFP, CPWA), Photo, Short bio, LinkedIn URL, Advisor profile link, Show as speaker only (switch).

## Body components

Editors build the body of Blog, Events and Lead Magnets posts with components inside the rich text: video, GIF or demo, callout, stat row, table, quote, step list, download, CTA, image gallery. This depends on Webflow's rich-text component support and needs confirming with whoever builds it.

## URLs

Blog item pages sit under one fixed prefix, so audience and type can't be in the item URL. Breadcrumbs on the page show the path (Resources > Advisors > Product > Title), using a Primary audience field for shared items.

Each content type has one listing page, not one per audience. The listing has an audience filter (All, Advisors, Clients). Hub rails link to it with the audience preselected.

| Page | URL | Built as |
|---|---|---|
| Resources hub | `/resources` | Static page |
| Advisors hub | `/resources/advisors` | Static page |
| Clients hub | `/resources/clients` | Static page |
| Blog type listings | `/resources/product`, `/case-studies`, `/investment`, `/announcements`, `/advisor-blog`, `/client-blog` | Content Types collection template, so a new type is a new item |
| All articles | `/articles` | Static page, every Blog item, filterable |
| Blog items | `/articles/{slug}` | Blog collection template |
| Events listing | `/events` | Static page with audience filter |
| Event items | `/events/{slug}` | Events collection template. Existing `/events/*` URLs stay |
| Guides and Tools listing | `/guides` | Static page with audience filter |
| Lead magnet items | `/guides/{slug}` | Lead Magnets collection template |
| Topics, People | `/topics/{slug}`, `/authors/{slug}` | After launch |

Reserved slugs: `advisors` and `clients` can't be content types, because they share the `/resources/` folder. The site already uses the same pattern for `/press`: a static page plus a collection template under one name. Confirm on staging.

Redirects needed:
- `/blog-posts/*` to `/articles/*` (one wildcard rule, 267 live posts).
- Today's `/resources` (the client hub) moves to `/resources/clients`.
- `/advisors/resources` to `/resources/advisors`, `/advisors/blog` to `/resources/advisor-blog`.
- `/category/{slug}` to the matching type listing or topic.
- Existing static guide and landing pages to their `/guides/{slug}` URLs.

## Decided
- Item URLs use one fixed prefix per collection (option 1); breadcrumbs show the audience and type path. Articles live at `/articles/{slug}`.
- Events switch from registration form to recording form with an "Event ended" switch.
- Lead magnets live at `/guides/{slug}`.
- Topic and author pages are post-launch.
- Two-audience events are **one entry**. The page shows both registration forms, labeled, or only the matching one when the hub card link carries `?audience=`.
- Events register through an embedded form, not a link.

## Open decisions for Mary
1. **Topic list** (11 suggested) and **UVA's Economic Insights** (60 posts).
2. **Advisor Blog and Client Blog:** two types, or one type with the audience switches?
