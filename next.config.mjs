/** @type {import('next').NextConfig} */
let repoName = ''
if (process.env.GITHUB_REPOSITORY) {
  repoName = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')
}

// When deploying to GitHub Pages as a project page (e.g. https://user.github.io/jobswipe),
// assets and routes live under /<repo-name>.
// Set NEXT_PUBLIC_BASE_PATH="" if using a custom domain or user page (user.github.io).
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : repoName && !repoName.endsWith('.github.io')
      ? `/${repoName}`
      : ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
}

export default nextConfig

