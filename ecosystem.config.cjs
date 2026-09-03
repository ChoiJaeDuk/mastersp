module.exports = {
  apps: [
    {
      name: "mastersp",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3939",
      exec_mode: "fork",   // 중요
      instances: 1,        // 중요
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
