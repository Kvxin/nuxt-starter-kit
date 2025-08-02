# Nuxt 4 开发模板

一个功能不完备、开箱也不能即用的 Nuxt 4 开发模板。
目前还在慢慢往上加一点功能中....想到什么加什么了属于是

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📦 技术栈

- **框架**: Nuxt 4 + TypeScript
- **UI**: @nuxt/ui
- **国际化**: @nuxtjs/i18n
- **内容**: @nuxt/content
- **图片**: @nuxt/image

## ✅ TODO 列表

### 已完成

- [x] **国际化支持** - 中英文切换
- [x] **API 响应拦截器** - 统一数据处理
- [x] **多环境配置** - 开发/测试/生产环境
- [x] **UI 组件库** - @nuxt/ui 集成
- [x] **内容管理** - @nuxt/content 集成
- [x] **图片优化** - @nuxt/image 集成
- [x] **项目文档** - 开发标准和配置指南

### 开发中

- [ ] **认证系统** - JWT 认证、权限控制
- [ ] **状态管理** - Pinia 集成
- [ ] **测试框架** - Vitest 配置
- [ ] **PWA 支持** - 离线缓存、推送通知
- [ ] **SEO 优化** - Meta 标签、结构化数据
- [ ] **性能监控** - 应用性能分析

### 计划中

- [ ] **代码生成器** - 组件和页面模板
- [ ] **部署配置** - Docker、CI/CD
- [ ] **开发工具** - 调试工具、热重载优化
- [ ] **文档系统** - API 文档、组件文档

## 📁 项目结构

```
nuxt-app/
├── app/                    # 应用源代码
├── content/               # 内容文件
├── docs/                  # 项目文档
├── i18n/                  # 国际化配置
├── server/                # 服务端代码
└── types/                 # TypeScript 类型
```

## 📚 文档

- [自用 cursor 提示词](/.cursor/rules/)

## 🛠️ 可用脚本

```bash
pnpm dev              # 开发环境
pnpm build            # 构建应用
pnpm preview          # 预览构建
pnpm lint             # 代码检查
pnpm type-check       # 类型检查
```

---

**Happy Coding! 🎉**
