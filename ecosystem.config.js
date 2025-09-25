module.exports = {
  apps: [
    {
      name: "cms.fortyfive.shop",
      script: "npx",
      args: "next start -p " + (process.env.PORT || 3000),
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}