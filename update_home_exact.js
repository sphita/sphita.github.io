const fs = require('fs');
const path = require('path');

const filePath = '/home/adhyansh/sphita/github-repos/sphita.github.io/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const exactDatasetsHTML = `
        <section class="features container">
            <div class="text-block" style="max-width: 100%; margin-bottom: 2rem; grid-column: 1 / -1; text-align: center;">
                <h2 style="font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 1rem;">Featured <span style="color: var(--accent-blue);">Datasets</span></h2>
                <p style="color: var(--text-secondary); font-size: 1.15rem;">Highly normalized, streaming-optimized data engineered for foundation models.</p>
            </div>
            
            <div class="feature-card">
                <div class="icon" style="margin-bottom: 1.5rem;">
                    <span style="background: rgba(25, 113, 255, 0.15); color: var(--accent-blue); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(25, 113, 255, 0.3);">13.4K+ DOWNLOADS</span>
                </div>
                <h3 style="font-family: monospace; font-size: 1.1rem; word-break: break-all;">AdhyanshVerma/open-github-major-repos</h3>
                <p style="font-size: 0.95rem;">An elite, curated collection of GitHub commit metadata from the world's most influential technology companies: Microsoft, Google, Meta, and Intel.</p>
                <a href="dataset.html?id=AdhyanshVerma/open-github-major-repos" class="card-link">View Dataset &rarr;</a>
            </div>
            
            <div class="feature-card">
                <div class="icon" style="margin-bottom: 1.5rem;">
                    <span style="background: rgba(25, 113, 255, 0.15); color: var(--accent-blue); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(25, 113, 255, 0.3);">~1M ROWS</span>
                </div>
                <h3 style="font-family: monospace; font-size: 1.1rem; word-break: break-all;">AdhyanshVerma/stack-2021-12-01</h3>
                <p style="font-size: 0.95rem;">A highly normalized, streaming-optimized Stack Exchange corpus engineered for LLM reasoning and instruction tuning.</p>
                <a href="dataset.html?id=AdhyanshVerma/stack-2021-12-01" class="card-link">View Dataset &rarr;</a>
            </div>
            
            <div class="feature-card">
                <div class="icon" style="margin-bottom: 1.5rem;">
                    <span style="background: rgba(25, 113, 255, 0.15); color: var(--accent-blue); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(25, 113, 255, 0.3);">7.1B+ TOKENS</span>
                </div>
                <h3 style="font-family: monospace; font-size: 1.1rem; word-break: break-all;">AdhyanshVerma/pg-en</h3>
                <p style="font-size: 0.95rem;">A massive snapshot of the English Project Gutenberg catalog (50,871 files, ~7.14B tokens), formatted into Parquet and JSONL.</p>
                <a href="dataset.html?id=AdhyanshVerma/pg-en" class="card-link">View Dataset &rarr;</a>
            </div>
            
            <div style="grid-column: 1 / -1; text-align: center; margin-top: 2rem;">
                <a href="datasets.html" class="btn btn-outline">View All Datasets</a>
            </div>
        </section>
`;

content = content.replace(/<section class="features container">[\s\S]*?<\/section>/, exactDatasetsHTML);
fs.writeFileSync(filePath, content);
