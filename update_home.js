const fs = require('fs');
const path = require('path');

const filePath = '/home/adhyansh/sphita/github-repos/sphita.github.io/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Tech Stack Section
const techStackHTML = `
        <section class="container" style="padding: 3rem 20px; text-align: center; border-bottom: var(--glass-border); position: relative; z-index: 2;">
            <p style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem;">Powered By</p>
            <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; opacity: 0.6; font-weight: 600; font-size: 1.1rem;">
                <span>🤗 Hugging Face</span>
                <span>Python</span>
                <span>Pandas</span>
                <span>Rust</span>
                <span>Parquet</span>
            </div>
        </section>
`;

// 2. Stats Bar Section
const statsBarHTML = `
        <section class="container" style="padding: 4rem 20px 0; position: relative; z-index: 2;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; background: rgba(255,255,255,0.03); border: var(--glass-border); border-radius: 16px; padding: 2.5rem; backdrop-filter: blur(10px);">
                <div>
                    <h2 style="font-size: 2.5rem; color: var(--accent-blue); font-weight: 800; margin-bottom: 0.5rem;">11</h2>
                    <p style="color: var(--text-secondary); font-weight: 500;">Public Datasets</p>
                </div>
                <div>
                    <h2 style="font-size: 2.5rem; color: var(--accent-blue); font-weight: 800; margin-bottom: 0.5rem;">36K+</h2>
                    <p style="color: var(--text-secondary); font-weight: 500;">Total Downloads</p>
                </div>
                <div>
                    <h2 style="font-size: 2.5rem; color: var(--accent-blue); font-weight: 800; margin-bottom: 0.5rem;">7.1B+</h2>
                    <p style="color: var(--text-secondary); font-weight: 500;">Tokens Processed</p>
                </div>
                <div>
                    <h2 style="font-size: 2.5rem; color: var(--accent-blue); font-weight: 800; margin-bottom: 0.5rem;">100%</h2>
                    <p style="color: var(--text-secondary); font-weight: 500;">Open Source</p>
                </div>
            </div>
        </section>
`;

// 3. Featured Datasets Section (Replacing the generic Features section)
const featuredDatasetsHTML = `
        <section class="features container">
            <div class="text-block" style="max-width: 100%; margin-bottom: 2rem; grid-column: 1 / -1; text-align: center;">
                <h2 style="font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 1rem;">Featured <span style="color: var(--accent-blue);">Datasets</span></h2>
                <p style="color: var(--text-secondary); font-size: 1.15rem;">Highly normalized, streaming-optimized data engineered for foundation models.</p>
            </div>
            
            <div class="feature-card">
                <div class="icon" style="margin-bottom: 1.5rem;">
                    <span style="background: rgba(25, 113, 255, 0.15); color: var(--accent-blue); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(25, 113, 255, 0.3);">13.4K+ DOWNLOADS</span>
                </div>
                <h3>Open GitHub Major Repos</h3>
                <p>An elite, curated collection of GitHub commit metadata from the world's most influential technology companies: Microsoft, Google, Meta, and Intel.</p>
                <a href="https://huggingface.co/datasets/AdhyanshVerma/open-github-major-repos" class="card-link" target="_blank">View on Hugging Face &rarr;</a>
            </div>
            
            <div class="feature-card">
                <div class="icon" style="margin-bottom: 1.5rem;">
                    <span style="background: rgba(25, 113, 255, 0.15); color: var(--accent-blue); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(25, 113, 255, 0.3);">~1M ROWS</span>
                </div>
                <h3>ReasonStack-Prime</h3>
                <p>A highly normalized, streaming-optimized Stack Exchange corpus specifically engineered for LLM reasoning and instruction tuning.</p>
                <a href="https://huggingface.co/datasets/AdhyanshVerma/stack-2021-12-01" class="card-link" target="_blank">View on Hugging Face &rarr;</a>
            </div>
            
            <div class="feature-card">
                <div class="icon" style="margin-bottom: 1.5rem;">
                    <span style="background: rgba(25, 113, 255, 0.15); color: var(--accent-blue); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(25, 113, 255, 0.3);">7.1B+ TOKENS</span>
                </div>
                <h3>Project Gutenberg En</h3>
                <p>A massive, 7.14 billion BPE token snapshot of the English Project Gutenberg catalog, formatted elegantly into Parquet and JSONL.</p>
                <a href="https://huggingface.co/datasets/AdhyanshVerma/pg-en" class="card-link" target="_blank">View on Hugging Face &rarr;</a>
            </div>
            
            <div style="grid-column: 1 / -1; text-align: center; margin-top: 2rem;">
                <a href="datasets.html" class="btn btn-outline">View All Datasets</a>
            </div>
        </section>
`;

// Inject below hero section
content = content.replace('</section>', '</section>\n' + techStackHTML + statsBarHTML);

// Replace the old generic feature cards block
content = content.replace(/<section class="features container">[\s\S]*?<\/section>/, featuredDatasetsHTML);

fs.writeFileSync(filePath, content);
console.log("Updated index.html");
