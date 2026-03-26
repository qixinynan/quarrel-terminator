# QuarrelTerminator - 争端终结者

<div align="center">

![QuarrelTerminator Logo](https://via.placeholder.com/150x150?text=QT)

**AI驱动的争端解决平台**

[在线演示](#) | [用户手册](./USER_MANUAL.md) | [部署文档](./DEPLOYMENT.md)

</div>

---

## 项目简介

QuarrelTerminator（争端终结者）是一个基于AI的争端解决平台，帮助用户公正、高效地解决各类争端。通过先进的AI技术，平台能够客观分析各方立场和证据，提供中立的评判和解决方案。

### 核心功能

- 🔐 **用户系统** - 注册、登录、个人管理
- 👥 **小组协作** - 创建争端小组，邀请成员加入
- 📝 **证据提交** - 支持文字和图片资料上传
- 🤖 **AI分析** - 智能分析立场，提供解决方案
- 🔄 **实时同步** - WebSocket实时数据更新
- 📱 **响应式设计** - 完美适配各种设备

---

## 技术栈

### 前端
- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **React Hook Form** - 表单处理
- **Zustand** - 状态管理
- **Socket.io Client** - 实时通信

### 后端
- **Next.js API Routes** - 服务端API
- **MongoDB + Mongoose** - 数据库
- **NextAuth.js** - 身份认证
- **OpenAI API** - AI分析
- **Cloudinary** - 图片存储
- **Socket.io** - 实时通信

### 部署
- **Vercel** - 应用托管
- **MongoDB Atlas** - 数据库托管
- **GitHub Actions** - CI/CD

---

## 快速开始

### 环境要求

- Node.js 18.x+
- npm 9.x+
- MongoDB 数据库
- OpenAI API 密钥
- Cloudinary 账户

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/quarrel-terminator.git
cd quarrel-terminator
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入配置：
```env
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 http://localhost:3000

---

## 项目结构

```
quarrel-terminator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   │   ├── auth/          # 认证相关
│   │   │   ├── groups/        # 小组管理
│   │   │   ├── materials/     # 资料管理
│   │   │   └── analyze/       # AI分析
│   │   ├── auth/              # 认证页面
│   │   ├── dashboard/         # 控制台
│   │   ├── group/             # 小组详情
│   │   └── join/              # 加入小组
│   ├── components/            # 可复用组件
│   ├── contexts/              # React Context
│   └── lib/                   # 工具库
│       ├── models/            # 数据模型
│       ├── auth.ts            # 认证配置
│       ├── db.ts              # 数据库连接
│       └── ai.ts              # AI分析
├── public/                    # 静态资源
├── .github/                   # GitHub配置
│   └── workflows/             # CI/CD工作流
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## API文档

### 认证API

#### 注册
```
POST /api/auth/register
Body: { email, password, name }
```

#### 登录
```
POST /api/auth/[...nextauth]
使用 NextAuth.js 凭证登录
```

### 小组API

#### 创建小组
```
POST /api/groups
Body: { name, description }
```

#### 加入小组
```
POST /api/groups/join
Body: { inviteCode }
```

### 资料API

#### 提交文字资料
```
POST /api/materials
Body: { groupId, type, title, content }
```

#### 上传图片资料
```
POST /api/materials/image
FormData: { file, groupId, content }
```

### AI分析API

#### 开始分析
```
POST /api/analyze
Body: { groupId }
```

---

## 部署

详细部署说明请查看 [部署文档](./DEPLOYMENT.md)。

### Vercel一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/quarrel-terminator)

---

## 开发指南

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 TypeScript 确保类型安全
- 遵循 Next.js 最佳实践
- 组件采用函数式写法

---

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 联系方式

- 项目地址: [GitHub](https://github.com/your-username/quarrel-terminator)
- 问题反馈: [Issues](https://github.com/your-username/quarrel-terminator/issues)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给一个星标！⭐**

</div>
