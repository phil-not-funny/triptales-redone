import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  devIndicators: {
    position: "top-right"
  },
  agentRules: false
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
