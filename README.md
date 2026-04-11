# 零基础个人名片模板（GitHub Pages）

这是**单页静态网站**：不用安装 Node、不用打包，改一个配置文件就能换文案和链接。设计目标见仓库里的 `plan.md` 与 `.cursor/skills/beginner-friendly-static-template/SKILL.md`。

---

## 三步上线

1. **Fork 本仓库**（或下载 ZIP 后推到你的 GitHub 仓库）。
2. **只改 `config.js`**：名字、学校、头像路径、各页列表、仓库链接等都在里面的 `CONFIG` 对象里，像填表一样改字符串和数组即可。
3. **打开 GitHub Pages**：仓库 Settings → Pages → Source 选主分支根目录，保存后等待 1～3 分钟，用 `https://你的用户名.github.io/仓库名/` 访问（用户名小写、仓库名与地址规则以 GitHub 文档为准）。

---

## 文件是干什么的（你只需要关心这几个）

| 文件 | 谁改 | 说明 |
|------|------|------|
| **`config.js`** | **主要改这里** | 全站文案、链接、列表、是否显示某一整页幻灯片 |
| `index.html` | 一般不用动 | 页面骨架；内容由 `script.js` 根据配置填充 |
| `script.js` | 一般不用动 | 轮播、深色模式、把 `CONFIG` 写到页面上 |
| `theme.css` | 想换配色时改 | **所有颜色变量**集中在这里（与 Tailwind 用的 `--tw-*` 等） |
| `style.css` | 一般不用动 | 少量遗留样式 |
| `icons/` | 可选用 | 水印、小图标等静态图 |

---

## 换头像（最常见操作）

1. 准备一张方形头像，例如 `avatar.jpg`。
2. 放到仓库里任意路径，**推荐**新建文件夹 `assets/`，路径写成 `assets/avatar.jpg`。
3. 在 `config.js` 里改：

```js
profile: {
  avatar: 'assets/avatar.jpg',
  avatarAlt: '你的名字或照片说明',
  // ...
}
```

保存、提交、推送；若已开启 Pages，等一两分钟再强制刷新页面（见下文「常见问题」）。

---

## 隐藏某一整页（不删代码）

在 `config.js` 的 `slides` 数组里，把对应项的 `enabled` 改成 `false` 即可。例如不显示「实习经验」：

```js
{ id: 'internship', enabled: false, navLabel: '实习经验', navAriaLabel: '实习经验' },
```

底部圆点导航中对应按钮会一起隐藏，轮播只会切换仍启用的页面。

---

## 配色与主题

- **改颜色**：编辑 `theme.css` 顶部的变量（如 `--palette-doc-accent`、`--tw-brand-*`），保存即可。
- 页面使用 **Tailwind CSS 官方 CDN** 做布局与工具类，主题色通过 `index.html` 里的 `tailwind.config` 与 `theme.css` 里的 RGB 变量对齐。
- **教学/内网环境注意**：CDN 需要能访问 `cdn.tailwindcss.com` 与 `fonts.googleapis.com`。若网络拦截，页面可能样式异常；可自行下载字体与 Tailwind 构建产物替换（进阶，非零基础路径）。本仓库刻意保持**零构建**，方便新手。

---

## 常见问题

- **改了网页却没变**：浏览器或 CDN 缓存。试 `Ctrl+F5` / 无痕窗口，或等 GitHub Pages 部署完成后再试。
- **图片裂了**：检查 `config.js` 里的路径是否和仓库里**完全一致**（大小写、子目录、扩展名）。
- **主按钮跳错页**：检查 `links.primaryCtaSlideId` 是否为 `slides` 里某个 `id`（如 `research`），且该页未被 `enabled: false` 关掉。

---

## 进阶：人设示例（复制到 `config.js` 参考）

下面是一段「偏 AI 方向学生」的示例片段，可按需合并进你的 `CONFIG`（注意逗号与嵌套）：

```js
profile: {
  greetingLead: '你好，我是',
  displayName: '张小智',
  locationLine: '某某大学 · 人工智能专业',
  intro: '对深度学习和开源社区感兴趣，这是我的静态名片与项目入口。',
  quote: '「保持好奇，多写可运行的 demo。」',
  avatar: 'assets/avatar.jpg',
  avatarAlt: '张小智',
  aboutTitle: 'About Me',
  aboutRows: [
    { label: '方向', value: '机器学习 / 视觉' },
    { label: 'GitHub', value: 'zhangxiaozhi', href: 'https://github.com/zhangxiaozhi' },
    { label: '邮箱', value: 'hi@example.com', href: 'mailto:hi@example.com' }
  ]
},
skills: {
  title: '技能',
  columns: [
    {
      sections: [
        { heading: 'Language', items: ['Python', 'English'] },
        { heading: 'ML', items: ['PyTorch', 'NumPy'] }
      ]
    },
    {
      sections: [{ heading: 'Tools', items: ['Git', 'Linux', 'VS Code'] }]
    },
    {
      sections: [{ heading: 'Projects', items: ['课程大作业', 'Kaggle 入门'] }]
    }
  ]
}
```

---

## 与仓库内其他文档

- `goals.md`、`repo.md`：项目背景与协作说明。
- `plan.md`：中文产品化思路与「填表改网站」的完整叙述。

若你只想快速改出个人主页：**打开 `config.js` → 改 `CONFIG` → 推送 → 开 Pages** 即可。
