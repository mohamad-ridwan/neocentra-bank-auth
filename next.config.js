const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  reactStrictMode: true,
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'auth_remote',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            shared_remote: 'shared_remote@http://localhost:3342/_next/static/chunks/remoteEntry.js',
          },
          exposes: {
            './Login': './src/components/LoginForm.tsx',
            './VerifyOtp': './src/components/OtpForm.tsx',
            './Logout': './src/components/LogoutHandler.tsx',
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            'react-dom': { singleton: true, requiredVersion: false },
            '@reduxjs/toolkit': { singleton: true },
            'react-redux': { singleton: true },
            '@tanstack/react-query': { singleton: true },
            '@radix-ui/react-tooltip': { singleton: true },
            '@radix-ui/react-slot': { singleton: true },
          },
        })
      );
    } else {
      config.externals = [
        ...(config.externals || []),
        {
          'shared_remote/store': 'commonjs shared_remote/store',
          'shared_remote/Button': 'commonjs shared_remote/Button',
          'shared_remote/Input': 'commonjs shared_remote/Input',
          'shared_remote/apiHelper': 'commonjs shared_remote/apiHelper',
          'shared_remote/AuthWrapper': 'commonjs shared_remote/AuthWrapper',
          'shared_remote/Tooltip': 'commonjs shared_remote/Tooltip',
        }
      ];
    }
    return config;
  },
};
