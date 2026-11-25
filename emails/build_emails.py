#!/usr/bin/env python3
"""Generates Nurture Series emails 2-6 (HTML + header sources) using the Email 1 look and feel.
Email 1 (nurture-1.html, header-swim.html) is hand-built and is the approved reference.

    python3 build_emails.py            # writes header-N.html + nurture-N.html
Then render the header PNGs (see render_headers.js) before previewing.
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
SANS = "'Inter',Arial,Helvetica,sans-serif"
GOLD, GREEN, DIV = "#8E7E57", "#175242", "#E6E6E6"
TXT = "#404040"

# ----------------------------------------------------------------------------- HEADER IMAGES
HDR_CSS = """
  @font-face{font-family:'ABC Diatype';font-weight:300;src:url('fonts/ABCDiatype-Light.otf')}
  @font-face{font-family:'ABC Diatype';font-weight:400;src:url('fonts/ABCDiatype-Regular.otf')}
  @font-face{font-family:'ABC Diatype';font-weight:500;src:url('fonts/ABCDiatype-Medium.otf')}
  @font-face{font-family:'Big Caslon';font-weight:400;src:url('fonts/BigCaslon-Regular.otf')}
  *{box-sizing:border-box;margin:0}
  body{background:#fff}
  #hdr{position:relative;width:600px;height:__H__px;overflow:hidden;font-family:'ABC Diatype',Arial,sans-serif;color:#fff;
       background:linear-gradient(135deg,#0F3B2E 0%,#175242 55%,#215F4D 100%)}
  .logo{position:absolute;top:36px;left:40px;width:84px}
  .left{position:absolute;left:40px;top:96px;display:flex;flex-direction:column;align-items:flex-start;gap:20px}
  .eyebrow{border:1px solid rgba(199,188,161,.55);border-radius:999px;padding:7.25px 14px 6.75px;font-size:9.5px;line-height:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;color:#C7BCA1}
  h1{font-weight:300;font-size:__FS__px;line-height:__LH__px;letter-spacing:-.04em;white-space:nowrap}
  h1 .serif{font-family:'Big Caslon',Georgia,serif;font-weight:400;letter-spacing:-.01em}
  .sub{font-weight:300;font-size:14px;line-height:20px;color:rgba(255,255,255,.82);white-space:nowrap}
  .right{position:absolute;right:40px;top:40px;bottom:__RB__px;width:236px;display:flex;flex-direction:column;justify-content:center}
  .card{background:#fff;color:#000;border-radius:8px;padding:6px 16px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
  .li{display:flex;align-items:center;gap:12px;padding:13px 0;border-top:1px solid #E6E6E6;font-size:11.5px;line-height:15px;font-weight:400}
  .li:first-child{border-top:0}
  .li img{width:22px;height:22px;flex:none}
  .li .t{flex:1}
  .new{font-size:8px;line-height:9px;letter-spacing:.08em;text-transform:uppercase;color:#8E7E57;border:1px solid #8E7E57;border-radius:3px;padding:2px 4px;margin-left:6px;vertical-align:1px;font-weight:500}
  .tiles{display:flex;flex-direction:column;gap:8px}
  .tile{display:flex;align-items:center;justify-content:space-between;background:#fff;color:#000;border-radius:6px;height:38px;padding:0 14px;font-size:11.5px;box-shadow:0 6px 18px rgba(0,0,0,.14)}
  .tile svg{width:14px;height:14px;flex:none}
"""

ICON = {"clock": "assets/icon-clock.png", "globe": "assets/icon-globe.png", "circles": "assets/icon-circles.png"}
ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="#000" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>'


def list_card(rows):
    out = ['<div class="card">']
    for icon, text, new in rows:
        tag = '<span class="new">New</span>' if new else ''
        out.append(f'<div class="li"><img src="{ICON[icon]}" alt=""><span class="t">{text}{tag}</span></div>')
    out.append('</div>')
    return "\n".join(out)


def tiles(labels):
    return '<div class="tiles">' + "".join(f'<div class="tile"><span>{l}</span>{ARROW}</div>' for l in labels) + '</div>'


HEADERS = {
    2: dict(eyebrow="Meet the team", h1="The people<br>behind <span class='serif'>SWIM</span>", fs=40,
            sub="A quick introduction to the team<br>behind your clients&rsquo; portfolios.",
            graphic=list_card([("clock", "Guided by our CIO", 0), ("globe", "A team that works alongside you", 0), ("circles", "Questions welcome", 0)]),
            alt="The people behind SWIM. A quick introduction to the team behind your clients' portfolios."),
    3: dict(eyebrow="What you get", h1="What SWIM gives<br><span class='serif'>your practice</span>", fs=32,
            sub="The benefits behind the numbers.",
            graphic=list_card([("clock", "Time back for what matters", 0), ("globe", "Investment strategies that fit your clients&rsquo; goals", 0), ("circles", "One place, full picture", 0)]),
            alt="What SWIM gives your practice. The benefits behind the numbers."),
    4: dict(eyebrow="Strategies", h1="The strategies<br>behind <span class='serif'>SWIM</span>", fs=37,
            sub="A closer look at three of the<br>strategies you can offer.",
            graphic=list_card([("clock", "Savvy Total Portfolios", 0), ("globe", "Direct Indexing", 0), ("circles", "Savvy Fixed Income", 1)]),
            alt="The strategies behind SWIM. A closer look at three of the strategies you can offer."),
    5: dict(eyebrow="Straight answers", h1="Questions<br>about <span class='serif'>SWIM</span>", fs=40,
            sub="Time, taxes, and how SWIM<br>fits your approach.",
            graphic=list_card([("clock", "More time with my clients", 0), ("globe", "Taxes when I move a client", 0), ("circles", "Using my own approach", 0)]),
            alt="Questions about SWIM. Time, taxes, and how SWIM fits your approach."),
    6: dict(eyebrow="Quick check-in", h1="What would<br>help <span class='serif'>you</span>?", fs=40,
            sub="Pick a next step, or tell us<br>when to check back.",
            graphic=tiles(["Help choosing my first clients", "Materials to talk to my clients", "Hear from an advisor using SWIM", "A call with the SWIM team"]),
            alt="What would help you? Pick a next step, or tell us when to check back."),
}
HDR_H, HDR_RB = 336, 51


def header_html(n, c):
    css = (HDR_CSS.replace("__H__", str(HDR_H)).replace("__FS__", str(c["fs"])).replace("__LH__", str(c["fs"] + 2)).replace("__RB__", str(HDR_RB)))
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>Email {n} header image</title>
<!-- Source for assets/header-{n}.png. Rendered at 600x{HDR_H} @2x with Playwright (render_headers.js).
     Brand fonts (ABC Diatype + Big Caslon) load from ./fonts/ (licensed, git-ignored). Generated by build_emails.py. -->
<style>{css}</style></head><body>
<div id="hdr">
  <img class="logo" src="assets/savvy-wordmark-white.png" alt="Savvy">
  <div class="left">
    <div class="eyebrow">{c['eyebrow']}</div>
    <h1>{c['h1']}</h1>
    <div class="sub">{c['sub']}</div>
  </div>
  <div class="right">{c['graphic']}</div>
</div>
</body></html>
"""


# ----------------------------------------------------------------------------- EMAIL PIECES
def eyebrow(text, color=GOLD, mt=0):
    return f'<div style="margin-top:{mt}px;font-family:{SANS};font-size:11px;line-height:12px;letter-spacing:0.08em;text-transform:uppercase;color:{color};">{text}</div>'


def head(n, subject, preheader):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<title>Nurture Series | Email {n}</title>
<!--
  SAVVY NURTURE SERIES, EMAIL {n}
  Subject: {subject}
  Layout: 600px, table-based, inline styles (HubSpot / Outlook safe). Generated by build_emails.py from the Email 1 template.
  Fonts:  Inter only (Diatype stand-in) in the body; the header image uses ABC Diatype + Big Caslon.
  Image URLs: replace ./assets/... with HubSpot file-manager URLs on upload.
-->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  body {{ margin:0; padding:0; background:#F5F2EC; -webkit-text-size-adjust:100%; }}
  table {{ border-collapse:collapse; }}
  img {{ border:0; display:block; }}
  a {{ text-decoration:none; }}
  @media only screen and (max-width:620px) {{
    .container {{ width:100% !important; }}
    .px {{ padding-left:24px !important; padding-right:24px !important; }}
    .stack {{ display:block !important; width:100% !important; }}
  }}
</style>
</head>
<body style="margin:0;padding:0;background:#F5F2EC;">

<!-- PREHEADER -->
<span style="display:none;visibility:hidden;opacity:0;height:0;width:0;font-size:1px;line-height:1px;color:#F5F2EC;max-height:0;overflow:hidden;">
  {preheader}
</span>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F5F2EC" style="background:#F5F2EC;">
<tr><td align="center" style="padding:32px 12px 40px;">

  <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="width:600px;max-width:600px;background:#FFFFFF;">
"""


def header_img(n, alt):
    return f"""
    <!-- HEADER IMAGE (source: header-{n}.html, 1200x{HDR_H*2} @2x) -->
    <tr><td style="padding:0;line-height:0;font-size:0;">
      <img src="./assets/header-{n}.png" width="600" alt="{alt}" style="width:100%;max-width:600px;height:auto;">
    </td></tr>
"""


def intro(paras):
    ps = ['<p style="margin:0 0 18px;">Hi there,</p>']
    for i, p in enumerate(paras):
        ps.append(f'<p style="margin:0{" 0 18px" if i < len(paras)-1 else ""};">{p}</p>')
    body = "\n      ".join(ps)
    return f"""
    <!-- INTRO -->
    <tr><td class="px" style="padding:48px 48px 0;font-family:{SANS};font-size:16px;line-height:26px;color:#000000;">
      {body}
    </td></tr>
"""


def p(text, mt=8, size=16, lh=25, color=TXT):
    return f'<div style="margin-top:{mt}px;font-size:{size}px;line-height:{lh}px;color:{color};">{text}</div>'


def item(icon, title, body_html, first=False, last=False, kicker=None, border=DIV):
    top = "0" if False else f"1px solid {border}"
    pad = "28px 0 8px" if last else "28px 0 36px"
    k = eyebrow(kicker) if kicker else ""
    ttl_mt = 10 if kicker else 0
    return f"""
        <tr><td style="border-top:{top};padding:{pad};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="72" valign="top" style="width:72px;"><img src="./assets/icon-{icon}.png" width="48" height="48" alt="" style="width:48px;height:48px;"></td>
            <td valign="top" style="font-family:{SANS};">
              {k}
              <div style="margin-top:{ttl_mt}px;font-weight:500;font-size:20px;line-height:28px;letter-spacing:-0.01em;color:#000000;">{title}</div>
              {body_html}
            </td>
          </tr></table>
        </td></tr>
"""


def items(rows, top_pad=56, section_eyebrow=None, section_title=None):
    parts = []
    for i, r in enumerate(rows):
        parts.append(item(r["icon"], r["title"], r["body"], last=(i == len(rows)-1), kicker=r.get("kicker")))
    return f"""
    <!-- ITEMS -->
    <tr><td class="px" style="padding:{top_pad}px 48px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
{''.join(parts)}
      </table>
    </td></tr>
"""


def note(text, label="Note to team, delete before sending"):
    return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;"><tr>
      <td bgcolor="#F5F2EC" style="background:#F5F2EC;border:1px dashed #C7BCA1;padding:14px 16px;font-family:{SANS};font-size:13px;line-height:20px;color:#4D4D4D;"><span style="font-weight:500;color:#000000;">{label}:</span> {text}</td>
    </tr></table>"""


def btn_dark(label, kind="primary"):
    if kind == "primary":
        return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;border-collapse:separate;"><tr>
              <td bgcolor="#FFFFFF" style="background:#FFFFFF;border-radius:5px;"><a href="#" style="display:inline-block;padding:14px 26px;font-family:{SANS};font-size:15px;font-weight:500;line-height:20px;letter-spacing:0.015em;color:#000000;border-radius:5px;">{label}</a></td>
            </tr></table>"""
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;border-collapse:separate;"><tr>
              <td style="border:1px solid #FFFFFF;border-radius:5px;"><a href="#" style="display:inline-block;padding:13px 25px;font-family:{SANS};font-size:15px;font-weight:500;line-height:20px;letter-spacing:0.015em;color:#FFFFFF;border-radius:5px;">{label}</a></td>
            </tr></table>"""


def btn_light(label):
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;border-collapse:separate;"><tr>
              <td bgcolor="#000000" style="background:#000000;border-radius:5px;"><a href="#" style="display:inline-block;padding:14px 26px;font-family:{SANS};font-size:15px;font-weight:500;line-height:20px;letter-spacing:0.015em;color:#FFFFFF;border-radius:5px;">{label}</a></td>
            </tr></table>"""


def band(kicker, headline, body, buttons, top_gap=40):
    btns = "".join(btn_dark(l, k) for l, k in buttons)
    return f"""
    <!-- CTA BAND -->
    <tr><td style="padding:{top_gap}px 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#175242" style="background:#175242;">
        <tr><td class="px" style="padding:56px 48px;">
          {eyebrow(kicker, "#C7BCA1")}
          <h2 style="margin:16px 0 0;font-family:{SANS};font-weight:300;font-size:32px;line-height:34px;letter-spacing:-0.02em;color:#FFFFFF;">{headline}</h2>
          <p style="margin:16px 0 0;font-family:{SANS};font-size:16px;line-height:25px;color:rgba(255,255,255,0.85);">{body}</p>
          <div style="margin-top:16px;">{btns}</div>
        </td></tr>
      </table>
    </td></tr>
"""


def cio_block():
    return f"""
    <!-- FROM THE CIO -->
    <tr><td class="px" style="padding:56px 48px 56px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stack" width="96" valign="top" style="width:96px;padding-right:24px;">
          <img src="./assets/anshul-sharma.png" width="96" height="96" alt="Anshul Sharma" style="width:96px;height:96px;border-radius:50%;">
        </td>
        <td class="stack" valign="top" style="font-family:{SANS};">
          <div style="font-size:11px;line-height:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8E7E57;">From the CIO</div>
          <div style="margin-top:10px;font-weight:500;font-size:22px;line-height:28px;letter-spacing:-0.01em;color:#000000;">Anshul Sharma</div>
          <div style="margin-top:2px;font-size:14px;line-height:20px;color:#8E7E57;">Chief Investment Officer, Savvy Wealth</div>
          <div style="margin-top:14px;font-size:14px;line-height:22px;color:#404040;">Anshul leads Savvy&rsquo;s investment strategy, portfolio design, and platform innovation. Before joining Savvy, he spent nearly two decades at Bank of America, including as Head of Alternative Investment Strategy.</div>
        </td>
      </tr></table>
    </td></tr>
"""


def section(inner_html, pad="56px 48px 0", bg=None, bt=False):
    style = f"padding:{pad};"
    if bg:
        style += f"background:{bg};"
    attr = f' bgcolor="{bg}"' if bg else ""
    return f"""
    <tr><td class="px"{attr} style="{style}">
{inner_html}
    </td></tr>
"""


def signoff():
    return section(f'<div style="font-family:{SANS};font-size:16px;line-height:25px;color:#000000;">[Sign-off pending approval],<br>The SWIM team</div>', pad="8px 48px 56px")


def footer(lead=None, notes=None):
    lead_html = lead if lead else ""
    notes_html = "".join(f'<div style="margin-top:16px;text-align:left;">{n}</div>' for n in (notes or []))
    return f"""
    <!-- FOOTER (text = black at 70%, solid #4D4D4D for Outlook) -->
    <tr><td class="px" align="center" style="padding:40px 48px 44px;border-top:1px solid {DIV};font-family:{SANS};font-size:12px;line-height:19px;color:#4D4D4D;">
      <img src="./assets/savvy-wordmark-black.png" width="88" alt="Savvy" style="width:88px;height:auto;margin:0 auto 24px;">
      {lead_html}
      <div style="margin-top:16px;">Savvy Wealth, 41 East 11th Street, New York, NY 10003, United States</div>
      <div style="margin-top:6px;"><a href="#" style="color:#4D4D4D;text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp; <a href="#" style="color:#4D4D4D;text-decoration:underline;">Manage preferences</a></div>
      {notes_html}
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>
"""


DISCLOSURE = f"""<div style="font-family:{SANS};font-size:11px;line-height:17px;color:#4D4D4D;text-align:center;">
        <div>[Standard Savvy email disclosure]</div>
        <div style="margin-top:8px;">[SWIM disclosure]</div>
      </div>"""

CHOOSE = '<a href="#" style="color:#4D4D4D;text-decoration:underline;">Not the right time? Choose when to hear from us</a>'


def busy(text, link):
    return f'<div style="max-width:420px;margin:0 auto;">{text}<br><a href="#" style="color:#4D4D4D;text-decoration:underline;">{link}</a></div>'


# ----------------------------------------------------------------------------- EMAILS
def build(n, subject, preheader, middle, lead, notes=None):
    c = HEADERS[n]
    html = head(n, subject, preheader) + header_img(n, c["alt"]) + middle + footer(lead, notes)
    open(os.path.join(HERE, f"nurture-{n}.html"), "w").write(html)
    open(os.path.join(HERE, f"header-{n}.html"), "w").write(header_html(n, c))


# ---- Email 2: Meet the people behind SWIM
e2 = intro(["When you consider a new investment solution for your clients, it helps to know who is behind it. Here is a quick introduction to the SWIM team."])
e2 += items([
    dict(icon="clock", title="Guided by our CIO", body=p("Anshul Sharma, our Chief Investment Officer, leads Savvy&rsquo;s investment strategy and portfolio design. SWIM portfolios are designed in-house by our own team.")),
    dict(icon="globe", title="A team that works alongside you", body=p("The SWIM team manages the portfolios for the clients you choose to enroll, and reviews portfolios you send in. You decide which clients to enroll, and when.")),
    dict(icon="circles", title="Questions welcome", body=p("If you want to talk through a strategy before deciding anything, the SWIM team is glad to help.")),
])
def member(last=False):
    pad = "28px 0 0" if last else "28px 0 28px"
    return f"""
        <tr><td style="border-top:1px solid {DIV};padding:{pad};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td class="stack" width="88" valign="top" style="width:88px;padding-right:24px;">
              <table role="presentation" width="64" height="64" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#F5F2EC" style="width:64px;height:64px;background:#F5F2EC;border-radius:50%;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
            </td>
            <td class="stack" valign="top" style="font-family:{SANS};">
              <div style="font-weight:500;font-size:18px;line-height:26px;letter-spacing:-0.01em;color:#000000;">[Team member name]</div>
              <div style="margin-top:2px;font-size:14px;line-height:20px;color:#8E7E57;">[Title]</div>
              <div style="margin-top:10px;font-size:15px;line-height:23px;color:{TXT};">[One-line bio, confirmed by that person and the SWIM team]</div>
            </td>
          </tr></table>
        </td></tr>"""


spotlight = (eyebrow("The SWIM team") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">'
             + member() + member() + member(True) + '</table>')
e2 += section(spotlight, pad="48px 48px 56px")
e2 += band("Your next step", "Want to talk it through?",
           "Book time with the SWIM team to ask questions before you decide anything, or get to know the team first.",
           [("Chat with the SWIM team", "primary"), ("Get to know the SWIM team", "secondary")])
e2 += cio_block() + signoff()
build(2, "Meet the people behind SWIM", "A quick introduction to the team behind your clients' portfolios.", e2, CHOOSE,
      [DISCLOSURE])

# ---- Email 3: What advisors get back (by the numbers + quotes)
STAT_NUM = f"font-family:{SANS};font-weight:300;font-size:48px;line-height:52px;letter-spacing:-0.04em;color:#175242;"
STAT_LAB = f"margin-top:8px;font-family:{SANS};font-size:15px;line-height:22px;color:{TXT};"


def stat(num, label, border_top=True, border_left=False, pad_left=0):
    bt = f"border-top:1px solid {DIV};" if border_top else ""
    bl = f"border-left:1px solid {DIV};" if border_left else ""
    return f'<td class="stack" width="50%" valign="top" style="width:50%;{bt}{bl}padding:28px 16px 28px {pad_left}px;"><div style="{STAT_NUM}">{num}</div><div style="{STAT_LAB}">{label}</div></td>'


stats = f"""      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>{stat('75%', 'of Savvy advisors have enrolled clients in SWIM')}{stat('$4.6B', 'in client assets enrolled in SWIM', border_left=True, pad_left=28)}</tr>
        <tr>{stat('9 hrs', 'a week back, on average, reported by advisors who outsource investment management')}{stat('12', 'strategies, on average, in each SWIM advisor&rsquo;s practice, all managed by the SWIM team', border_left=True, pad_left=28)}</tr>
      </table>
      <div style="margin-top:32px;font-family:{SANS};font-size:12px;line-height:19px;color:#4D4D4D;">Savvy figures are internal data as of November 2026. 9 hours a week: AssetMark / 8 Acre Perspective, &ldquo;The Impact of Outsourcing,&rdquo; 697 advisors surveyed January to March 2024. Not specific to Savvy advisors.</div>"""


def quote(img, alt, text, name, title, first=False):
    bt = f"border-top:1px solid {DIV};" if not first else f"border-top:1px solid {DIV};"
    return f"""
        <tr><td style="{bt}padding:32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td class="stack" width="120" valign="top" style="width:120px;padding-right:24px;"><img src="./assets/{img}" width="96" height="96" alt="{alt}" style="width:96px;height:96px;border-radius:50%;"></td>
            <td class="stack" valign="top" style="font-family:{SANS};">
              <div style="font-weight:300;font-size:19px;line-height:29px;letter-spacing:-0.01em;color:#000000;">&ldquo;{text}&rdquo;</div>
              <div style="margin-top:16px;font-weight:500;font-size:15px;line-height:20px;color:#000000;">{name}</div>
              <div style="margin-top:2px;font-size:14px;line-height:20px;color:#8E7E57;">{title}</div>
            </td>
          </tr></table>
        </td></tr>"""


quotes = (eyebrow("From advisors on Savvy") +
          f'<div style="margin-top:12px;font-family:{SANS};font-size:16px;line-height:25px;color:#000000;">Hear from advisors who have enrolled clients in SWIM, in their own words.</div>'
          + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">'
          + quote("advisor-ed-wildermuth.png", "Ed Wildermuth", "It&rsquo;s really given me a lot more time back. It&rsquo;s been amazing to take the portfolio manager hat off, give it to the SWIM team, and really give myself back a lot of time to focus in those client meetings.", "Ed Wildermuth", "Senior Financial Planner, Mosaic Wealth Advisors")
          + quote("advisor-derek-williams.png", "Derek Williams", "The financial models that we have through SWIM allow us to align clients&rsquo; risk tolerance and allocate correctly to a portfolio built out that the Savvy team has created, and they&rsquo;re constantly improving it.", "Derek Williams", "Co-Founder, True Harvest Private Wealth")
          + quote("advisor-steven-harp.png", "Steven Harp", "It&rsquo;s a way for us to almost subcontract that piece of the business so we aren&rsquo;t the ones having to day trade, and we could focus on our client. Our clients are benefiting greatly because the performance speaks for itself.", "Steven Harp", "Founder and CEO, Colorado Wealth Group")
          + '</table>')

e3 = intro(["A quick look at how advisors across Savvy use SWIM today."])
e3 += section(stats, pad="48px 48px 0")
e3 += section(quotes, pad="64px 48px 56px")
e3 += band("Your next step", "Ready to see it with your own clients?",
           "Choose a household you would like the SWIM team to review. You pick the client and the timing.",
           [("Review a household today", "primary"), ("See why advisors enroll", "secondary")], top_gap=0)
build(3, "Here is what advisors get back when they enroll clients in SWIM", "75% of Savvy advisors have enrolled clients in SWIM. Here is what they get back.", e3,
      busy("Busy right now? That is okay. Let us know when to check back in so SWIM stays on your radar without the extra emails.", "Choose when we check back"))

# ---- Email 4: The strategies behind SWIM
def fy(label, text):
    return f'<div style="margin-top:10px;font-size:16px;line-height:25px;color:{TXT};"><span style="font-weight:500;color:#000000;">{label}</span> {text}</div>'


new_tag = f'<span style="display:inline-block;margin-left:8px;padding:3px 6px;border:1px solid {GOLD};border-radius:3px;font-size:10px;line-height:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:{GOLD};vertical-align:3px;">New</span>'
e4 = intro(["SWIM gives you a range of investment strategies to match to your clients. Here is a closer look at 3 of them, including our newest, Savvy Fixed Income."])
e4 += items([
    dict(icon="clock", title="Savvy Total Portfolios", body=p("Actively managed portfolios from our investment team, led by our CIO.") + fy("For you:", "the SWIM team handles day-to-day management, so you spend less time on portfolio upkeep.") + fy("For your clients:", "a professionally managed portfolio, designed by an in-house team and managed on an ongoing basis.")),
    dict(icon="globe", title="Direct Indexing", body=p("Lets a client hold the individual stocks of an index instead of a fund.") + fy("For you:", "a way to offer more personalized portfolios without building them yourself.") + fy("For your clients:", "a portfolio that can reflect their preferences.")),
    dict(icon="circles", title="Savvy Fixed Income" + new_tag, body=p("Our newest strategy, built for the fixed income part of a client&rsquo;s portfolio.") + fy("For you:", "the SWIM team manages the bond allocation, so you don&rsquo;t have to build and maintain it yourself.") + fy("For your clients:", "a professionally managed fixed income allocation that fits alongside the rest of their portfolio.")),
])
e4 += band("Your next step", "Ready to see one in action?", "You can submit a portfolio review task any time.", [("See all SWIM strategies", "primary")])
e4 += section(f'<div style="font-family:{SANS};font-size:16px;line-height:25px;color:#000000;">[Sign-off pending approval],<br>The SWIM team</div>', pad="48px 48px 56px")
build(4, "The strategies behind SWIM", "A closer look at 3 SWIM strategies, including our newest, Savvy Fixed Income.", e4, CHOOSE,
      [DISCLOSURE])

# ---- Email 5: Questions advisors ask
step_items = [
    dict(icon="globe", kicker="Step 1", title="You submit a request", body=p("Choose the clients you want to enroll and submit your enrollment request.")),
    dict(icon="circles", kicker="Step 2", title="We handle the setup", body=p("The SWIM team handles the implementation for each client you enroll.")),
    dict(icon="clock", kicker="Step 3", title="We manage day to day", body=p("Research, rebalancing, and trading continue with the SWIM team.")),
]
steps_html = "".join(item(r["icon"], r["title"], r["body"], last=(i == 2), kicker=r["kicker"]) for i, r in enumerate(step_items))
process = f"""      {eyebrow('The process')}
      <h2 style="margin:16px 0 0;font-family:{SANS};font-weight:300;font-size:32px;line-height:34px;letter-spacing:-0.02em;color:#000000;">What happens after you enroll</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">{steps_html}</table>"""

e5 = intro(["Advisors tell us the same few things come up when they think about SWIM. Here are straight answers."])
e5 += items([
    dict(icon="clock", title="Will I get more time with my clients?", body=p("Yes. The SWIM team takes over the back-office work of investment management, like research, rebalancing, and trading, so you have more time for client conversations. You still choose which clients to enroll and when, and your clients stay your clients.")),
    dict(icon="globe", title="What about taxes when I move a client?", body=p("SWIM portfolios are tax-aware. Moving a client into a new portfolio can have tax implications, so before you decide, the SWIM team can prepare a transition analysis that shows what a move would involve.") + btn_light("Request a transition analysis") + note("Confirm availability, wording, and the request link with the SWIM team and compliance.")),
    dict(icon="circles", title="Can I still use my own approach for some clients?", body=p("Yes. You decide client by client. SWIM sits alongside how you manage other clients today, and advisor custom models are available when a client needs a more tailored approach.") + note("Confirm with the SWIM team.")),
])
e5 += f'\n    <tr><td style="padding:40px 0 0;"></td></tr>\n' + section(process, pad="56px 48px 56px", bg="#FFF8F1")
e5 += band("Your next step", "We&rsquo;re here when you&rsquo;re ready", "Have a question about taxes, timing, or how SWIM fits with your approach? The SWIM team can walk you through it.", [("Talk to the SWIM team", "primary")], top_gap=0)
build(5, "Questions advisors ask before enrolling clients in SWIM", "Time, taxes, and how SWIM fits your approach. Straight answers from the SWIM team.", e5,
      busy("Busy right now? That&rsquo;s okay. Choose when we check back, and we&rsquo;ll pause these emails until then.", "Choose when we check back"))

# ---- Email 6: A quick check-in on SWIM
def option(title, desc, last=False):
    pad = "28px 0 8px" if last else "28px 0 28px"
    return f"""
        <tr><td style="border-top:1px solid {DIV};padding:{pad};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="top" style="font-family:{SANS};">
              <a href="#" style="font-weight:500;font-size:20px;line-height:28px;letter-spacing:-0.01em;color:#000000;">{title}</a>
              <div style="margin-top:8px;font-size:16px;line-height:25px;color:{TXT};">{desc}</div>
            </td>
            <td width="40" align="right" valign="top" style="width:40px;font-family:{SANS};font-size:22px;line-height:28px;color:{GOLD};"><a href="#" style="color:{GOLD};">&rarr;</a></td>
          </tr></table>
        </td></tr>
"""


opts = [("Help me find investment opportunities for my clients", "The SWIM team reviews your book and suggests which households to start with."),
        ("Send me materials to talk to my clients", "Get the client conversation toolkit, with explainers and answers to common client questions."),
        ("Connect me with an advisor using SWIM", "Hear from an advisor who has already enrolled clients and ask what it was like."),
        ("Set up a call with the SWIM team", "Talk through your questions, your timing, or anything else on your mind.")]
e6_opts = eyebrow("What would help most?") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">' + "".join(option(t, d, i == 3) for i, (t, d) in enumerate(opts)) + '</table>' + note("Confirm each option exists and who fulfills it (SWIM team, toolkit, advisor intros need advisor consent and compliance review). Link each to a tracked page or form so every click records interest.")
e6 = intro(["You&rsquo;ve been part of Savvy for a few months now, and we wanted to check in on your investment management experience.",
            "Every advisor&rsquo;s path to SWIM is unique. Some start with a few clients, some enroll in bulk during their transition, and others take their time. We&rsquo;d like to know where we can help you most."])
e6 += section(e6_opts, pad="56px 48px 0")
e6 += band("Your next step", "Ready for a closer look?", "Submit a portfolio review task in your dashboard, and the SWIM team will send you a report.", [("Submit a portfolio review task", "primary")])
build(6, "A quick check-in on SWIM", "You've been part of Savvy for a few months. Tell us where we can help most.", e6, None)
print("built emails 2-6 + headers")
