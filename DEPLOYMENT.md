# QuarrelTerminator 部署文档

## 目录
1. [环境要求](#环境要求)
2. [本地开发](#本地开发)
3. [Vercel部署](#vercel部署)
4. [环境变量配置](#环境变量配置)
5. [数据库配置](#数据库配置)
6. [CI/CD配置](#cicd配置)
7. [自定义域名](#自定义域名)

---

## 环境要求

### 开发环境
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- Git

### 外部服务
- MongoDB 数据库（推荐 MongoDB Atlas）
- OpenAI API 密钥
- Cloudinary 账户（图片存储）

---

## 本地开发

### 1. 克隆项目
```bash
git clone https://github.com/your-username/quarrel-terminator.git
cd quarrel-terminator
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制环境变量示例文件：
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入实际的配置值：
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quarrel-terminator
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 5. 构建生产版本
```bash
npm run build
npm run start
```

---

## Vercel部署

### 方式一：通过Vercel Dashboard

#### 1. 创建Vercel账户
访问 [vercel.com](https://vercel.com) 注册账户。

#### 2. 导入项目
1. 点击 "New Project"
2. 选择 "Import Git Repository"
3. 授权并选择您的GitHub仓库
4. 点击 "Import"

#### 3. 配置项目
- Framework Preset: Next.js
- Root Directory: ./
- Build Command: `npm run build`
- Output Directory: `.next`

#### 4. 配置环境变量
在 "Environment Variables" 部分添加所有必要的环境变量。

#### 5. 部署
点击 "Deploy" 开始部署。

### 方式二：通过Vercel CLI

#### 1. 安装Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录Vercel
```bash
vercel login
```

#### 3. 部署项目
```bash
vercel
```

#### 4. 部署到生产环境
```bash
vercel --prod
```

---

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `MONGODB_URI` | MongoDB连接字符串 | MongoDB Atlas |
| `NEXTAUTH_SECRET` | NextAuth加密密钥 | 运行 `openssl rand -base64 32` |
| `NEXTAUTH_URL` | 应用URL | 本地: `http://localhost:3000`<br>生产: 您的域名 |
| `OPENAI_API_KEY` | OpenAI API密钥 | OpenAI平台 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary云名称 | Cloudinary控制台 |
| `CLOUDINARY_API_KEY` | Cloudinary API密钥 | Cloudinary控制台 |
| `CLOUDINARY_API_SECRET` | Cloudinary API密钥 | Cloudinary控制台 |

### 在Vercel中配置

1. 进入项目设置页面
2. 点击 "Environment Variables"
3. 添加每个变量
4. 选择适用的环境（Production、Preview、Development）
5. 重新部署项目使配置生效

---

## 数据库配置

### MongoDB Atlas设置

#### 1. 创建账户
访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 注册账户。

#### 2. 创建集群
1. 选择免费套餐（M0）
2. 选择离您最近的区域
3. 点击 "Create Cluster"

#### 3. 创建数据库用户
1. 进入 "Database Access"
2. 点击 "Add New Database User"
3. 设置用户名和密码
4. 选择 "Read and write to any database"

#### 4. 配置网络访问
1. 进入 "Network Access"
2. 点击 "Add IP Address"
3. 添加 `0.0.0.0/0`（允许所有IP，适合Vercel）

#### 5. 获取连接字符串
1. 点击 "Connect"
2. 选择 "Connect your application"
3. 复制连接字符串
4. 替换 `<password>` 为您的密码

---

## CI/CD配置

### GitHub Actions设置

#### 1. 添加GitHub Secrets
在GitHub仓库设置中添加以下Secrets：

| Secret名称 | 说明 |
|------------|------|
| `VERCEL_TOKEN` | Vercel API令牌 |
| `VERCEL_ORG_ID` | Vercel组织ID |
| `VERCEL_PROJECT_ID` | Vercel项目ID |
| `MONGODB_URI` | MongoDB连接字符串 |
| `NEXTAUTH_SECRET` | NextAuth密钥 |
| `NEXTAUTH_URL` | 生产环境URL |
| `OPENAI_API_KEY` | OpenAI API密钥 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary云名称 |
| `CLOUDINARY_API_KEY` | Cloudinary API密钥 |
| `CLOUDINARY_API_SECRET` | Cloudinary API密钥 |

#### 2. 获取Vercel信息
```bash
# 登录Vercel
vercel login

# 链接项目
vercel link

# 查看项目信息
vercel project ls
```

在 `.vercel/project.json` 中可以找到 `orgId` 和 `projectId`。

#### 3. 创建Vercel令牌
1. 访问 Vercel Account Settings
2. 进入 "Tokens"
3. 点击 "Create Token"
4. 复制令牌值

### 自动部署流程
- 推送到 `main` 或 `master` 分支时自动部署到生产环境
- 创建Pull Request时自动创建预览环境
- 构建失败时会收到GitHub通知

---

## 自定义域名

### 1. 添加域名
1. 在Vercel项目设置中点击 "Domains"
2. 输入您的域名
3. 点击 "Add"

### 2. 配置DNS
根据Vercel提供的指引配置DNS记录：

#### 方式一：使用A记录
```
A Record: 76.76.21.21
```

#### 方式二：使用CNAME
```
CNAME: cname.vercel-dns.com
```

### 3. 启用HTTPS
Vercel自动为自定义域名配置SSL证书，无需额外操作。

### 4. 更新环境变量
部署自定义域名后，更新 `NEXTAUTH_URL` 为新的域名。

---

## 监控与日志

### Vercel Analytics
1. 在项目设置中启用 Analytics
2. 查看访问数据和性能指标

### 运行时日志
1. 进入项目部署页面
2. 点击 "Functions" 标签
3. 查看实时日志

### 错误追踪
建议集成 Sentry 进行错误追踪：
```bash
npm install @sentry/nextjs
```

---

## 故障排除

### 常见问题

#### 1. 构建失败
- 检查环境变量是否正确配置
- 查看 build log 了解具体错误
- 确保所有依赖都已正确安装

#### 2. 数据库连接失败
- 检查 MongoDB URI 是否正确
- 确认IP白名单设置
- 验证数据库用户权限

#### 3. 图片上传失败
- 检查 Cloudinary 配置
- 确认 API 密钥有效
- 检查文件大小限制

#### 4. AI分析失败
- 验证 OpenAI API 密钥
- 检查 API 配额
- 确认模型可用性

---

## 性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 压缩图片大小
   - 利用 Cloudinary 自动优化

2. **数据库优化**
   - 创建适当的索引
   - 使用连接池
   - 定期清理过期数据

3. **缓存策略**
   - 启用 Vercel Edge Cache
   - 使用 Next.js Image 组件
   - 配置适当的 Cache-Control 头

---

*最后更新：2024年*
