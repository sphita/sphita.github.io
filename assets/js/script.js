// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchDatasets();
    renderBlogGrid();
    loadBlogPost();
    loadSingleDataset();
    setupLockAnimation();
});

// Fetch datasets from Hugging Face dynamically for datasets.html
async function fetchDatasets() {
    const grid = document.getElementById('datasets-grid');
    if (!grid) return;
    
    try {
        const author = grid.getAttribute("data-author") || "AdhyanshVerma";
        const res = await fetch(`https://huggingface.co/api/datasets?author=${author}`);
        const datasets = await res.json();
        
        grid.innerHTML = '';
        datasets.forEach(dataset => {
            const card = document.createElement('div');
            card.className = 'feature-card dataset-card';
            
            const desc = dataset.description ? dataset.description.replace(/[\n\t]+/g, " ").substring(0, 100) + "..." : "No description provided.";
            card.innerHTML = `
                <div class="dataset-stats" style="margin-bottom: 1rem;">
                    <span>⬇ ${dataset.downloads || 0}</span>
                    <span style="margin-left: 1rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path d="M22.45,6a5.47,5.47,0,0,1,3.91,1.64,5.7,5.7,0,0,1,0,8L16,26.13,5.64,15.64a5.7,5.7,0,0,1,0-8,5.48,5.48,0,0,1,7.82,0L16,10.24l2.53-2.58A5.44,5.44,0,0,1,22.45,6m0-2a7.47,7.47,0,0,0-5.34,2.24L16,7.36,14.89,6.24a7.49,7.49,0,0,0-10.68,0,7.72,7.72,0,0,0,0,10.82L16,29,27.79,17.06a7.72,7.72,0,0,0,0-10.82A7.49,7.49,0,0,0,22.45,4Z"></path></svg> ${dataset.likes || 0}</span>
                </div>
                <h3 style="font-family: monospace; word-break: break-all; font-size: 1.05rem;">${dataset.id}</h3>
                <p style="font-size: 0.9rem; margin: 10px 0; color: #a0aec0;">${desc}</p>
                <p style="font-size: 0.8rem; color: #718096;">Updated: ${new Date(dataset.lastModified).toLocaleDateString()}</p>
                <a href="dataset.html?id=${dataset.id}" class="card-link">View Details &rarr;</a>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = '<p>Failed to load datasets.</p>';
    }
}

// Fetch and render single dataset README on dataset.html
async function loadSingleDataset() {
    const titleEl = document.getElementById('dataset-title');
    if (!titleEl) return; // Not on dataset.html
    
    const urlParams = new URLSearchParams(window.location.search);
    const datasetId = urlParams.get('id');
    
    if (!datasetId) {
        titleEl.textContent = "Dataset Not Found";
        document.getElementById('dataset-readme').innerHTML = "";
        return;
    }
    
    titleEl.textContent = datasetId;
    document.getElementById('hf-link').href = `https://huggingface.co/datasets/${datasetId}`;
    document.getElementById('hf-link').style.display = 'inline-block';
    
    try {
        // Fetch API metadata for badges
        fetch(`https://huggingface.co/api/datasets/${datasetId}`)
            .then(res => res.json())
            .then(data => {
                const metaDiv = document.getElementById('dataset-meta');
                metaDiv.innerHTML = `
                    <span class="badge">⬇ ${data.downloads || 0} Downloads</span>
                    <span class="badge"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path d="M22.45,6a5.47,5.47,0,0,1,3.91,1.64,5.7,5.7,0,0,1,0,8L16,26.13,5.64,15.64a5.7,5.7,0,0,1,0-8,5.48,5.48,0,0,1,7.82,0L16,10.24l2.53-2.58A5.44,5.44,0,0,1,22.45,6m0-2a7.47,7.47,0,0,0-5.34,2.24L16,7.36,14.89,6.24a7.49,7.49,0,0,0-10.68,0,7.72,7.72,0,0,0,0,10.82L16,29,27.79,17.06a7.72,7.72,0,0,0,0-10.82A7.49,7.49,0,0,0,22.45,4Z"></path></svg> ${data.likes || 0} Likes</span>
                    <span class="badge">📅 Updated ${new Date(data.lastModified).toLocaleDateString()}</span>
                `;
            }).catch(e => console.log(e));

        // Fetch README
        const readmeRes = await fetch(`https://huggingface.co/datasets/${datasetId}/resolve/main/README.md`);
        if (!readmeRes.ok) throw new Error("README not found");
        
        const markdown = await readmeRes.text();
        // Remove YAML frontmatter from HF README
        const cleanMarkdown = markdown.replace(/^---[\s\S]*?---\n/, '');
        
        document.getElementById('dataset-readme').innerHTML = marked.parse(cleanMarkdown);
    } catch (err) {
        document.getElementById('dataset-readme').innerHTML = "<p>No README available for this dataset.</p>";
    }
}

function renderBlogGrid() {
    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid && typeof BLOG_INDEX !== 'undefined') {
        BLOG_INDEX.forEach(post => {
            const card = document.createElement('div');
            card.className = 'feature-card blog-card';
            card.innerHTML = `
                <span class="blog-date">${post.date}</span>
                <h3 class="blog-title">${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="post.html?id=${post.id}" class="card-link">Read Post &rarr;</a>
            `;
            blogGrid.appendChild(card);
        });
    }
}

function loadBlogPost() {
    const postContainer = document.getElementById('post-content');
    if (postContainer && typeof BLOG_INDEX !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const postMeta = BLOG_INDEX.find(p => p.id === postId);
        
        if (postMeta) {
            document.getElementById('post-title').textContent = postMeta.title;
            document.getElementById('post-date').textContent = postMeta.date + ' • By ' + postMeta.author;
            
            fetch(postMeta.file)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load post");
                    return res.text();
                })
                .then(text => {
                    // Very simple YAML frontmatter parser
                    let metadata = {};
                    let content = text;
                    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
                    if (match) {
                        const yamlBlock = match[1];
                        content = match[2];
                        yamlBlock.split('\n').forEach(line => {
                            const colonIndex = line.indexOf(':');
                            if (colonIndex > 0) {
                                const key = line.substring(0, colonIndex).trim();
                                const value = line.substring(colonIndex + 1).trim().replace(/^['"](.*)['"]$/, '$1');
                                metadata[key] = value;
                            }
                        });
                    }

                    // Prioritize frontmatter metadata over index fallback
                    const finalTitle = metadata.title || postMeta.title;
                    const finalAuthor = metadata.author || postMeta.author || "Sphita Team";
                    const finalDate = metadata.date || postMeta.date;
                    const readTime = metadata.read_time ? ` • ${metadata.read_time} read` : '';

                    document.getElementById('post-title').textContent = finalTitle;
                    document.getElementById('post-date').textContent = `${finalDate} • By ${finalAuthor}${readTime}`;
                    
                    postContainer.innerHTML = marked.parse(content);
                })
                .catch(err => {
                    postContainer.innerHTML = '<p>Error loading post content. The markdown file may be missing.</p>';
                });
        } else {
            document.getElementById('post-title').textContent = '404 - Post Not Found';
            postContainer.innerHTML = '<p>The post you are looking for does not exist or has been removed.</p>';
        }
    }
}

function setupLockAnimation() {
    const lock = document.querySelector('.hero .icon-monochrome');
    if(lock) {
        lock.addEventListener('mouseenter', () => {
            lock.src = 'assets/svgs/unlock.svg';
        });
        lock.addEventListener('mouseleave', () => {
            lock.src = 'assets/svgs/lock.svg';
        });
    }
}

// Number Count Up Animation
document.addEventListener("DOMContentLoaded", () => {
    const stats = document.querySelectorAll('.stat-number');
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let target = parseFloat(entry.target.getAttribute('data-target'));
                if (target === 0) return; // Skip 0
                let count = 0;
                let speed = target / 40; // ~40 frames
                
                let updateCount = () => {
                    count += speed;
                    if (count < target) {
                        entry.target.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.innerText = target;
                        if (entry.target.hasAttribute('data-suffix')) {
                            entry.target.innerText += entry.target.getAttribute('data-suffix');
                        }
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
});

// Crypto Checkout Modal Logic
function openCryptoModal() {
    document.getElementById('crypto-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCryptoModal() {
    document.getElementById('crypto-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function copyAddress(id, btn) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy!", err);
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('crypto-modal');
    if (event.target === modal) {
        closeCryptoModal();
    }
});
