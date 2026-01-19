/**
 * 同时启动：
 * - 后端：根目录 `npm run dev`（nodemon 热更新，默认 3333）
 * - 前端：client 目录 `npm run dev -- --hostname 0.0.0.0 --port 3000`（Nuxt 热更新，默认基路径 /audiobookshelf）
 *
 * 设计目标：
 * - 不引入额外依赖（concurrently / npm-run-all）
 * - Ctrl+C 能同时退出两个子进程
 */

const { spawn } = require('child_process')
const { execSync } = require('child_process')
const path = require('path')

const isWin = process.platform === 'win32'
const npmBin = isWin ? 'npm.cmd' : 'npm'

/**
 * 启动前清理端口占用（用于重复启动/崩溃后残留进程的场景）
 * 仅处理监听该端口的进程，避免误杀无关进程。
 * @param {number} port
 */
function killPort(port) {
  try {
    if (isWin) {
      // Windows: netstat 找到 LISTENING 的 PID，再 taskkill
      const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim()
      if (!out) return
      const pids = Array.from(
        new Set(
          out
            .split(/\r?\n/)
            .map((line) => line.trim().split(/\s+/).pop())
            .filter(Boolean)
        )
      )
      pids.forEach((pid) => {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
        } catch {}
      })
      return
    }

    // macOS / Linux: lsof 输出 PID
    const pids = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN || true`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    if (!pids.length) return
    // 强制结束，避免进程不响应 SIGINT/SIGTERM 导致启动失败
    execSync(`kill -9 ${pids.join(' ')} || true`, { stdio: 'ignore' })
  } catch {}
}

function spawnNpm(args, cwd) {
  return spawn(npmBin, args, {
    cwd,
    stdio: 'inherit',
    env: process.env
  })
}

const rootCwd = process.cwd()
const clientCwd = path.join(rootCwd, 'client')

// 先强制清理后端端口，避免重复启动时 EADDRINUSE
killPort(3333)

// 后端：nodemon
const server = spawnNpm(['run', 'dev'], rootCwd)

// 前端：Nuxt dev（绑定到 0.0.0.0 便于局域网访问）
const client = spawnNpm(['run', 'dev', '--', '--hostname', '0.0.0.0', '--port', '3000'], clientCwd)

let exiting = false
function shutdown(code = 0) {
  if (exiting) return
  exiting = true

  // 尽量优雅退出，超时则强杀
  try {
    if (server && !server.killed) server.kill('SIGINT')
  } catch {}
  try {
    if (client && !client.killed) client.kill('SIGINT')
  } catch {}

  setTimeout(() => {
    try {
      if (server && !server.killed) server.kill('SIGKILL')
    } catch {}
    try {
      if (client && !client.killed) client.kill('SIGKILL')
    } catch {}
    process.exit(code)
  }, 2000).unref()
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

server.on('exit', (code) => {
  // 其中一个退出，整体退出
  shutdown(typeof code === 'number' ? code : 1)
})
client.on('exit', (code) => {
  shutdown(typeof code === 'number' ? code : 1)
})

