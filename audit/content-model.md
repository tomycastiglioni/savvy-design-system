# Resources CMS fields (v1, simplified)

Replaces v0. Three main collections hold the content. Three small collections hold things that need their own page or are reused across collections. Everything else (FAQs, CTAs, disclosures, audience, series, format) is a field on the item.

Nothing here has been built in Webflow.

## Collections

| Type | Collection | Purpose |
|---|---|---|
| Main | **Blog** | Every article-shaped item: Product, Case Study, Investment, Announcement, Advisor Blog, Client Blog |
| Main | **Events** | Webinars, open houses, recaps |
| Main | **Lead Magnets** | Guides, e-books, calculators, reports, advisor campaigns |
| Reference | **Content Types** | The 6 blog types. Holds listing intro text, SEO and hub placement. Does not generate pages |
| Reference | **Topics** | Subject tags (Tax, Retirement, Estate...) |
| Reference | **People** | Authors and event speakers |

Fields that are NOT collections: Audience (two switches), FAQ, Disclosure. Series are Topics. Blog has no Format field: video, GIF, charts and downloads are components in the body.

## Blog

| Group | Field | Type | Notes |
|---|---|---|---|
| Basics | Name | Text | Title / H1 |
| | Slug | Text | |
| | Subtext | Text | Shown below the headline. Write it as a direct 1 to 2 sentence answer |
| | Hero image | Image | |
| | Thumbnail | Image | Card image |
| Routing | Content type | Reference (one) to Content Types | Required |
| | Topics | Multi-reference to Topics | Includes series such as Global Markets Recap |
| | Show on Advisors hub | Switch | |
| | Show on Clients hub | Switch | Both on = shared item, one entry |
| Display | Featured on Advisors hub | Switch | Pins to the top slot, sorted by date |
| | Featured on Clients hub | Switch | |
| | Show as banner until | Date | Empty = no banner. Banner disappears after this date |
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
| Topics | Multi-reference to Topics | |
| Event format | Option | Webinar, In person, Open house |
| Start date and time | Date | Upcoming or past is computed from this |
| End date and time | Date | |
| Time zone | Option | |
| Location | Text | In-person only |
| Thumbnail, Hero image | Image | |
| Summary | Text | Card text |
| Description | Rich text | |
| Speakers | Multi-reference to People | |
| Registration link, general | Link | Used when there is one link |
| Registration link, advisors | Link | Optional second link |
| Registration link, clients | Link | Optional second link |
| Registration button label | Text | Default "Register" |
| Recording link | Video link | After the event |
| Recap post | Reference to Blog | Optional |
| Also show on Product listing | Switch | Savvy Intelligence Open House |
| Featured on Advisors hub, Featured on Clients hub | Switch | |
| FAQ 1 to 3, question and answer | Text | 3 pairs |
| Disclosure type | Option | |
| Meta title, Meta description | Text | |

Hub display rule: the Advisors hub shows the advisors link, else the general link. The Clients hub shows the clients link, else the general link.

## Lead Magnets

| Field | Type | Notes |
|---|---|---|
| Name, Slug | Text | |
| Format | Option | Guide, E-book, Checklist, Template, Report, Calculator or tool, Webinar replay |
| Show on Advisors hub | Switch | |
| Show on Clients hub | Switch | |
| Topics | Multi-reference to Topics | |
| Hide from listings | Switch | On for one-off advisor campaign pages |
| Cover image | Image | |
| Summary | Text | Card text |
| Description | Rich text | |
| What's inside | Rich text | Bullets |
| Gated | Switch | |
| HubSpot form ID | Text | |
| Download file | File | Delivered after the form |
| Tool link | Link | For calculators |
| Thank-you message | Text | |
| Thank-you next step, label and link | Text, Link | |
| Advisor | Reference to Advisor Directory | Optional, for advisor campaigns |
| Campaign name | Text | UTM or tracking |
| Authors | Multi-reference to People | Optional |
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

This is what lets editors reorder the hub rails without a designer. Listing pages are static pages under each hub (see URLs), so a new type also needs a listing page duplicated under each hub that shows it.

## Topics (reference)

Name, Slug, Description, Meta title, Meta description, Sort order, Topic kind (option: Subject or Series, so filters can list subjects only).

Topics include series: Global Markets Recap, Portfolio Perspectives, Inside the Markets, Capability stories, Under the hood, Why Savvy.

## People (reference)

Name, Slug, Role, Credentials (CFP, CPWA), Photo, Short bio, LinkedIn URL, Advisor profile link, Show as speaker only (switch).

## Body components

Editors build the body of Blog, Events and Lead Magnets posts with components inside the rich text: video, GIF or demo, callout, stat row, table, quote, step list, download, CTA, image gallery. This depends on Webflow's rich-text component support and needs confirming with whoever builds it.

## URLs

Item pages sit under one fixed prefix per collection, so audience and type can't be in the item URL. Breadcrumbs on the page show the path (Resources > Advisors > Product > Title), using a Primary audience field for shared items.

| Page | URL | Built as |
|---|---|---|
| Resources hub | `/resources` | Static page |
| Advisors hub | `/resources/advisors` | Static page |
| Clients hub | `/resources/clients` | Static page |
| Advisors listings | `/resources/advisors/product`, `/case-studies`, `/investment`, `/announcements`, `/advisor-blog`, `/events` | Static pages, each a list filtered to one type and the Advisors switch |
| Clients listings | `/resources/clients/investment`, `/announcements`, `/client-blog`, `/events`, `/guides-and-tools` | Static pages, same pattern |
| All reads | `/blog` | Static page: every Blog item, filterable by audience, type and topic |
| Blog items | `/blog/{slug}` | Blog collection template |
| Event items | `/events/{slug}` | Events collection template. Existing `/events/*` pages keep their URLs |
| Lead magnet items | `/guides/{slug}` | Lead Magnets collection template |
| Topics, People | `/topics/{slug}`, `/authors/{slug}` | Collection pages, after launch. At launch People only feeds the byline and schema |

Redirects needed:
- `/blog-posts/*` to `/blog/*` (one wildcard rule, 267 live posts).
- `/category/{slug}` to the matching listing or topic page.
- `/resources` today is the client hub, so its content moves to `/resources/clients`.
- `/advisors/resources` to `/resources/advisors`, `/advisors/blog` to `/resources/advisors/advisor-blog`.
- Existing static guide and landing pages to their Lead Magnet URLs.

Shared types (Investment, Announcements, Events) have a listing under each hub, but the item pages are the same single URLs.

## Decided
- Item URLs use one fixed prefix per collection (option 1); breadcrumbs show the audience and type path.
- Lead magnets live at `/guides/{slug}`.
- Topic and author pages are post-launch.
- Two-link events are **one entry**. Hub cards show only the matching audience link (advisors link, clients link, else general). The event page itself shows both links, labeled "Advisors register" and "Clients register", because one URL can't know which hub the visitor came from.

## Open decisions for Mary
1. **Topic list** (11 suggested) and **UVA's Economic Insights** (60 posts).
2. **Advisor Blog and Client Blog:** two types, or one type with the audience switches?
3. **Naming:** `/blog` holds all six types, not only blog posts.
