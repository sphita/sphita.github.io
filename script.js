document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear > 2026 ? `2026 - ${currentYear}` : '2026';
    }

    // Mobile menu toggle
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

    // Lock Animation Logic
    const openSourceCard = document.getElementById('open-source-card');
    const lockClosed = document.querySelector('.lock-closed');
    const lockOpen = document.querySelector('.lock-open');

    if (openSourceCard && lockClosed && lockOpen) {
        openSourceCard.addEventListener('mouseenter', () => {
            // Animates to open state via JS
            lockClosed.style.opacity = '0';
            lockClosed.style.transform = 'scale(0.8) translateY(0)';
            lockClosed.style.filter = 'drop-shadow(0 0 0 rgba(25,113,255,0))';
            
            lockOpen.style.opacity = '1';
            lockOpen.style.transform = 'scale(1.15) translateY(-5px)';
            lockOpen.style.filter = 'drop-shadow(0 4px 12px rgba(25, 113, 255, 0.6))';
        });

        openSourceCard.addEventListener('mouseleave', () => {
            // Animates back to closed state via JS
            lockClosed.style.opacity = '1';
            lockClosed.style.transform = 'scale(1) translateY(0)';
            lockClosed.style.filter = 'drop-shadow(0 0 0 rgba(25,113,255,0))';
            
            lockOpen.style.opacity = '0';
            lockOpen.style.transform = 'scale(0.8) translateY(0)';
            lockOpen.style.filter = 'drop-shadow(0 0 0 rgba(25,113,255,0))';
        });
    }

    // Hugging Face Dynamic Dataset Fetcher
    const datasetsGrid = document.getElementById('datasets-grid');
    if (datasetsGrid) {
        async function fetchHuggingFaceDatasets() {
            try {
                // Fetch datasets authored by 'sphita'
                const response = await fetch('https://huggingface.co/api/datasets?author=sphita&sort=downloads&direction=-1');
                const datasets = await response.json();

                if (!datasets || datasets.length === 0) {
                    datasetsGrid.innerHTML = '<p style="color: var(--text-secondary);">No datasets found yet. Check back soon or view our <a href="https://huggingface.co/sphita" style="color: var(--accent-blue);">Hugging Face profile</a>.</p>';
                    return;
                }

                datasetsGrid.innerHTML = ''; // Clear loading text
                
                datasets.forEach(ds => {
                    const name = ds.id.split('/')[1] || ds.id;
                    const card = document.createElement('div');
                    card.className = 'feature-card dataset-card';
                    
                    // Format dates and numbers
                    const downloads = ds.downloads ? ds.downloads.toLocaleString() : '0';
                    const likes = ds.likes ? ds.likes.toLocaleString() : '0';
                    
                    card.innerHTML = `
                        <h3>${name}</h3>
                        <div class="dataset-stats">
                            <span><svg class="svg-icon" style="width:16px;height:16px;fill:currentColor;" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h520v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg> ${downloads}</span>
                            <span>❤️ ${likes}</span>
                        </div>
                        <p>Automatically synced from Hugging Face.</p>
                        <a href="https://huggingface.co/datasets/${ds.id}" target="_blank" class="card-link">View on Hugging Face &rarr;</a>
                    `;
                    datasetsGrid.appendChild(card);
                });
            } catch (error) {
                console.error("Error fetching datasets:", error);
                datasetsGrid.innerHTML = '<p style="color: var(--text-secondary);">Failed to load datasets. Please visit our <a href="https://huggingface.co/sphita" style="color: var(--accent-blue);">Hugging Face profile</a> directly.</p>';
            }
        }
        
        fetchHuggingFaceDatasets();
    }

    // Blog Hub Logic
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

    // Single Post Logic
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
