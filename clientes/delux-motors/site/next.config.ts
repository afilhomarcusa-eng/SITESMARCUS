import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /procuro virou /comprar quando os formulários passaram a ser um por
      // serviço. O endereço antigo já pode ter sido mandado para alguém no
      // WhatsApp, então ele continua chegando no lugar certo em vez de dar 404.
      { source: "/procuro", destination: "/comprar", permanent: true },
    ];
  },
};

export default nextConfig;
