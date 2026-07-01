const NextFederationPlugin = require("@module-federation/nextjs-mf");
const path = require("path");

const getRemoteUrl = (name, defaultLocalUrl) => {
  if (process.env.NODE_ENV === "production") {
    // In production, Nginx handles routing under a single domain via subpaths
    return `${name}_remote@/mf-${name}/_next/static/chunks/remoteEntry.js`;
  }
  return `${name}_remote@${process.env[`NEXT_PUBLIC_REMOTE_${name.toUpperCase()}_URL`] || defaultLocalUrl}/_next/static/chunks/remoteEntry.js`;
};

module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "auth_remote",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            shared_remote: getRemoteUrl("shared", "http://localhost:3342"),
          },
          exposes: {
            "./Login": "./src/components/login/LoginForm.tsx",
            "./VerifyOtp": "./src/components/otp/OtpForm.tsx",
            "./Logout": "./src/components/LogoutHandler.tsx",
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            "react-dom": { singleton: true, requiredVersion: false },
            "@reduxjs/toolkit": { singleton: true },
            "react-redux": { singleton: true },
            "@tanstack/react-query": { singleton: true },
            "@radix-ui/react-tooltip": { singleton: true },
            "@radix-ui/react-slot": { singleton: true },
          },
        }),
      );
    } else {
      config.externals = [
        ...(config.externals || []),
        {
          "shared_remote/store": "commonjs shared_remote/store",
          "shared_remote/Button": "commonjs shared_remote/Button",
          "shared_remote/Input": "commonjs shared_remote/Input",
          "shared_remote/apiHelper": "commonjs shared_remote/apiHelper",
          "shared_remote/AuthWrapper": "commonjs shared_remote/AuthWrapper",
          "shared_remote/Tooltip": "commonjs shared_remote/Tooltip",
        },
      ];
      config.resolve.alias = {
        ...config.resolve.alias,
        "shared_remote/useRemoteCSS": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/hooks/useRemoteCSS.ts",
        ),
        "shared_remote/federatedStats": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/utils/federated-stats.ts",
        ),
      };
    }
    return config;
  },
};
