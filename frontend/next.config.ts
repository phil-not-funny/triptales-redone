import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  devIndicators: {
    position: "top-right"
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
