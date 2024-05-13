module.exports = {
    apps: [
        {
            port: 8010,
            name: `Core Server`,
            script: "npm",
            args: "run start",
            instances: 2,
            exec_mode: "cluster",
            autorestart: true,
            node_args: "--max-http-header-size=81920",
            error_file: "./storage/logs/pm2/error.log",
            out_file: "./storage/logs/pm2/out.log",
            ignore_watch: ["node_modules"],
            dotenv_config_path: '.env',
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
