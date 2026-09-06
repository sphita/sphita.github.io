---
title: "How I Built a Rust Crawler That Escalates to Chrome When Blocked"
author: "Adhyansh Verma"
date: "September 6, 2026"
read_time: "5 min"
---

Most web crawlers give up when they hit a JavaScript-heavy SPA. Mine doesn't. It switches to a headless browser and keeps going.

This is the story of how I built **qween_crawler** — a tiered web scraping engine written in Rust that has crawled over 133,000 pages from Google, Meta, Intel, Python.org, and Anthropic, all running on a single desktop with no cloud budget.

### The Problem

I wanted to build open datasets from the websites of major tech companies. The problem is that these companies don't want you scraping them. Google Cloud's documentation is a React SPA. Meta's engineering blog loads everything via JavaScript. A normal HTTP request gets you an empty `<div id="root"></div>` and nothing else.

Existing crawlers like Scrapy or wget just... fail. They download the shell HTML and call it done. You end up with a dataset full of empty pages.

### The Architecture

I wrote qween_crawler with a **tiered escalation system**:

**Tier 1 — HTTP with TLS impersonation.** The first attempt uses `rquest` (a Rust HTTP client) with Chrome's TLS/JA4 fingerprint. At the TCP level, the server thinks it's talking to a real Chrome browser. This handles about 85% of pages and is extremely fast — hundreds of pages per second.

**Tier 3 — Headless Chromium via CDP.** When Tier 1 gets blocked (detected by checking if the response has too many `<script>` tags and too little actual content), the crawler automatically escalates to a real headless Chrome instance controlled via the Chrome DevTools Protocol. This is slower but bypasses JavaScript rendering requirements completely.

The escalation decision happens in real-time, per URL, with a configurable budget:

```
WARN  tier-1 blocked → escalating to tier-3
      url="https://cloud.google.com/ai/generative-ai"
      reason=phase-b:heavy-js-spa-script-count
      budget_left_ms=19253
```

### The Storage Problem

My first version wrote every page as a separate file. When I hit 75,000 files, the ext4 filesystem on my HDD started choking — `ls` took 30 seconds, and `find` was unusable. The OS was spending more time managing inodes than actually crawling.

So I rewrote the storage layer around **Apache Parquet**. Now every crawl session writes to chunked Parquet files with zstd compression. A 28 GB HTML crawl compresses down to about 6 GB. The LMDB-backed URL queue means I can stop and resume crawls without losing state.

### The Machine

Everything runs on my desktop: an Intel i7-12700F with 16 GB of RAM and a GTX 1650, running Kali Linux. The hostname is `WannaCry`. Storage is a mix of a 360 GB internal HDD and a 930 GB external. No AWS. No GCP. No rented GPUs. Total cloud spend: ₹0.

The crawler runs as a background daemon with proper SIGTERM handling. I can close my laptop, go to sleep, and check the dashboard in the morning:

```
crawled=133,812 | errored=3,313 | frontier=634,632
bytes_total=37,501,408,394 | tier1=114,342 | tier3=672
```

### What I Learned

1. **TLS fingerprinting matters more than User-Agent strings.** Most anti-bot systems don't even check your UA anymore. They check your TLS ClientHello. Using `rquest` with Chrome impersonation was the single biggest unlock.

2. **Parquet is not just for analytics.** It's the best format for storing crawl data. Columnar compression means you can store the full HTML in one column and still get fast reads on just the URL or status columns.

3. **Disk-space watchdogs are non-negotiable.** I learned this the hard way when a crawl filled my drive at 3 AM and corrupted the LMDB database. Now the crawler gracefully stops when free space drops below 1 GB.

4. **Show your errors.** Every dataset I publish includes the error rate. 133K pages with 3,313 errors is a 2.5% failure rate. That's real. Hiding it would be dishonest.

### What's Next

I'm currently crawling Python.org (38K pages so far) and Intel's entire web presence (104K pages). The goal is to build the largest collection of open, robots.txt-compliant web corpora on Hugging Face — all processed on spinning HDDs with zero infrastructure cost.

If you want to use the data, everything is on [Hugging Face](https://huggingface.co/AdhyanshVerma). If you find boilerplate I missed, PRs are welcome.
