# SEO & AI Discoverability — Post-Deploy Checklist

Complete these steps once the branch is deployed to `https://columbus.earth`.

---

## Submission

- [ ] **Google Search Console** → Sitemaps → Submit `https://columbus.earth/sitemap.xml`
- [ ] **Bing Webmaster Tools** → Sitemaps → Submit `https://columbus.earth/sitemap.xml`

## Verification

- [ ] **Confirm robots.txt** — use the robots.txt tester in both GSC and Bing; verify the `Sitemap:` line reads `https://columbus.earth/sitemap.xml`
- [ ] **Validate JSON-LD** — open `https://search.google.com/test/rich-results` and test:
  - [ ] Home page (`https://columbus.earth`)
  - [ ] A blog article (e.g. `https://columbus.earth/blog/why-llms-didnt-cut-it`)
  - [ ] Columbus Pro page (`https://columbus.earth/products/business`)

---

When each step is done, replace `- [ ]` with `- [x]`.
