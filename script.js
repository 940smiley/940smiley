class GitHubPortfolio {
    constructor() {
        this.username = '940smiley';
        this.featuredRepos = ['recoveredtreasures', 'giveawonderfulday', 'trashy-items'];
        this.languageColors = {
            'Python': '#3776ab',
            'JavaScript': '#f7df1e',
            'TypeScript': '#3178c6',
            'HTML': '#e34f26',
            'CSS': '#1572b6',
            'Java': '#ed8b00',
            'C++': '#00599c',
            'C': '#555555',
            'Go': '#00add8',
            'Rust': '#000000',
            'PHP': '#777bb4',
            'Ruby': '#cc342d',
            'Swift': '#fa7343',
            'Kotlin': '#7f52ff',
            'Dart': '#0175c2',
            'Shell': '#89e051'
        };
        
        this.init();
    }

    async init() {
        try {
            await this.loadRepositories();
        } catch (error) {
            console.error('Error loading repositories:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    async fetchRepositories() {
        const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async loadRepositories() {
        const repos = await this.fetchRepositories();
        
        // Filter out forks and sort by updated date
        const ownRepos = repos.filter(repo => !repo.fork);
        const sortedRepos = ownRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // Separate featured repos
        const featuredRepos = [];
        const otherRepos = [];

        sortedRepos.forEach(repo => {
            if (this.featuredRepos.includes(repo.name.toLowerCase())) {
                featuredRepos.push(repo);
            } else {
                otherRepos.push(repo);
            }
        });

        // Display repositories
        this.displayFeaturedRepos(featuredRepos);
        this.displayRecentRepos(otherRepos.slice(0, 6)); // Show top 6 recent
        this.displayAllRepos(otherRepos);
    }

    displayFeaturedRepos(repos) {
        const container = document.getElementById('featuredProjects');
        if (repos.length === 0) {
            container.innerHTML = '<p class="no-repos">Featured repositories will appear here when available.</p>';
            return;
        }
        container.innerHTML = repos.map(repo => this.createProjectCard(repo, true)).join('');
    }

    displayRecentRepos(repos) {
        const container = document.getElementById('recentProjects');
        container.innerHTML = repos.map(repo => this.createProjectCard(repo)).join('');
    }

    displayAllRepos(repos) {
        const container = document.getElementById('allProjects');
        container.innerHTML = repos.map(repo => this.createProjectCard(repo)).join('');
    }

    createProjectCard(repo, isFeatured = false) {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const description = repo.description || 'No description available';
        const language = repo.language || 'Unknown';
        const languageColor = this.languageColors[language] || '#586069';
        
        const featuredClass = isFeatured ? 'featured' : '';
        
        return `
            <div class="project-card ${featuredClass}">
                <div class="project-header">
                    <a href="${repo.html_url}" target="_blank" class="project-title">
                        <i class="fas fa-folder-open"></i>
                        ${repo.name}
                    </a>
                    <span class="project-visibility">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                
                <p class="project-description">${description}</p>
                
                <div class="project-stats">
                    <span class="stat">
                        <i class="fas fa-star"></i>
                        ${repo.stargazers_count}
                    </span>
                    <span class="stat">
                        <i class="fas fa-code-branch"></i>
                        ${repo.forks_count}
                    </span>
                    ${repo.size > 0 ? `
                    <span class="stat">
                        <i class="fas fa-database"></i>
                        ${this.formatSize(repo.size)}
                    </span>
                    ` : ''}
                </div>
                
                <div class="language-info">
                    <div class="language">
                        <div class="language-dot" style="background-color: ${languageColor}"></div>
                        ${language}
                    </div>
                    <span class="updated-date">Updated ${updatedDate}</span>
                </div>
            </div>
        `;
    }

    formatSize(sizeInKB) {
        if (sizeInKB < 1024) {
            return `${sizeInKB} KB`;
        } else if (sizeInKB < 1024 * 1024) {
            return `${(sizeInKB / 1024).toFixed(1)} MB`;
        } else {
            return `${(sizeInKB / (1024 * 1024)).toFixed(1)} GB`;
        }
    }

    showError() {
        const containers = ['featuredProjects', 'recentProjects', 'allProjects'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>Failed to load repositories. Please try again later.</p>
                </div>
            `;
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPortfolio();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
