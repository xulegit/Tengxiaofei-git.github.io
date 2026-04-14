/**
 * 个人名片 · 唯一推荐修改的文件（像填表一样改下面对象即可）
 * 说明见仓库根目录 README.md
 */
const CONFIG = {
  meta: {
    title: '徐乐 · 个人名片',
    description:
      '徐乐 — 复旦大学微电子学院2025级学生，正在努力学习中的新手名片',
    lang: 'zh-CN'
  },

  /** 顶栏与页脚文案 */
  site: {
    headerName: '徐乐',
    footerName: '徐乐',
    footerOrg: '复旦大学微电子学院',
    footerNote: '本页为 github.io 静态部署教程示例 · 左右滑动或方向键切换'
  },

  /**
   * 底部圆点导航顺序与每一「张」幻灯片
   * 不需要某一整页时，把对应项的 enabled 改为 false（不必删 HTML）
   */
  slides: [
    { id: 'home', enabled: true, navLabel: '主页', navAriaLabel: '首页' },
    { id: 'skills', enabled: true, navLabel: '技能', navAriaLabel: '技能与兴趣' },
    { id: 'research', enabled: true, navLabel: '科研经历', navAriaLabel: '科研经历' },
    { id: 'competition', enabled: true, navLabel: '竞赛获奖', navAriaLabel: '竞赛获奖' },
    { id: 'internship', enabled: true, navLabel: '实习经验', navAriaLabel: '实习经验' },
    { id: 'social', enabled: true, navLabel: '社会实践', navAriaLabel: '社会实践' }
  ],

  /** 装饰图：右下角水印；技能等卡片标题旁小图标 */
  assets: {
    watermark: 'assets/FDU.png',
    sectionIcon: 'assets/标题.svg'
  },

  profile: {
    greetingLead: '你好，我是',
    /** 首页大标题里渐变显示的名字 */
    displayName: '徐乐',
    locationLine: '复旦大学微电子学院 2025级',
    intro: '微电子专业萌新一枚，目前处于“啥也不会但充满热情”的阶段，正在努力从零开始。',
    quote: '「日月光华，旦复旦兮」',
    /** 头像：可把图片放到 assets/ 下，例如 assets/avatar.jpg */
    avatar: 'assets/秘书处_线条.png',
    avatarAlt: '徐乐头像',
    aboutTitle: 'About Me',
    /** 右侧「关于我」列表；有 href 时渲染为链接 */
    aboutRows: [
      { label: '年龄', value: '18岁（永远的萌新）' },
      { label: '爱好', value: '学习怎么学习、发呆、电子DIY入门' },
      {
        label: 'GitHub',
        value: 'xulegit',
        href: 'https://github.com/xulegit'
      },
      {
        label: '联系方式',
        value: 'lexu25@m.fudan.edu.cn',
        href: 'mailto:lexu25@m.fudan.edu.cn'
      }
    ]
  },

  links: {
    /** 右上角「GitHub 仓库」按钮 */
    repoUrl: 'https://github.com/xulegit/xulegit.github.io',
    repoLabel: 'GitHub 仓库',
    /** 主按钮文案与跳转的幻灯片 id（须为上面 slides 中某一 id） */
    primaryCtaLabel: '浏览经历',
    primaryCtaSlideId: 'research'
  },

  skills: {
    title: '技能',
    columns: [
      {
        sections: [
          {
            heading: 'Language',
            items: ['中文', 'English (CET-4 备考中)']
          },
          {
            heading: 'Interests',
            items: ['电子制作', '羽毛球', '看科技视频']
          }
        ]
      },
      {
        sections: [
          {
            heading: 'Tech (学习ing)',
            items: [
              'C语言 (刚学会指针)',
              'Python (print("hello"))',
              'Verilog (波形很美丽)',
              'Matlab (用来算数学作业)'
            ]
          }
        ]
      },
      {
        sections: [
          {
            heading: '近期在读（寻找书友中……）',
            items: ['《微电子电路》', '《CMOS集成电路设计》', '《如何阅读一本书》']
          }
        ]
      }
    ]
  },

  /** 各经历页：标题 + 字符串列表（留空数组则整段列表不渲染） */
  timelines: {
    research: {
      title: '科研经历',
      items: [
        '暂无正式科研经历，正在认真学习专业基础课',
        '积极关注课题组招新，未来可期'
      ]
    },
    competition: {
      title: '竞赛获奖经历',
      items: [
        '2025年复旦大学新生入学积极参与奖（手动狗头）',
        '尚未参加专业竞赛，正在积累知识准备中'
      ]
    },
    internship: {
      title: '实习经验',
      items: [
        '暂无实习经验，计划大二暑期开始投递',
        '目前在实验室打杂学习焊接技术'
      ]
    },
    social: {
      title: '社会实践',
      items: [
        '新生入学志愿者 · 引导新生报到',
        '宿舍熄灯后坚持不打扰室友挑战（成功中）'
      ]
    }
  }
}
