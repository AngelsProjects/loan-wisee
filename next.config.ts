import type { NextConfig } from 'next'

import analyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    // includePaths: ['./src/styles'],
    silenceDeprecations: ['legacy-js-api']
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com']
  },
  webpack(config) {
    // pdf worker config
    config.resolve.alias.canvas = false
    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/loans',
        permanent: true
      }
    ]
  }
}

// Sentry configuration
const sentryWebpackPluginOptions = {
  silent: true
}

export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryWebpackPluginOptions)
