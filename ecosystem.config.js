module.exports = {
  apps: [
    {
      name: "cms.fortyfive.shop",
      script: "npx",
      args: "next start ",
      env: {
        PORT: 60000,
        NODE_ENV: "production"
      }
    }
  ]
}