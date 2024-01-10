/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        Hello: process.env.HELLO,
    },
}

module.exports = nextConfig
