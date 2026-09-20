# SA 沙特选品用户站点

这是一个无需构建的静态页面，适合部署为 GitHub Pages 站点。页面从 `assets/products.csv` 读取商品；原有的 `assets/products.json` 保留作为旧数据，不会被页面读取。

页面首次打开默认阿拉伯语，可在页眉切换 English 或中文，选择保存在当前浏览器。商家列表每次显示 24 家，商品列表每次显示 48 件，通过“显示更多”继续浏览，避免一次性渲染全部卡片。界面文案会切换语言；商品名称、颜色、尺码保持 CSV 原文。分类原数据只有中英双语，阿拉伯语界面采用英文分类，不提供未经核对的自动翻译。

## 数据格式

创建 UTF-8 编码的 `assets/products.csv`，首行使用以下列名（顺序可以调整）：

```csv
row,product_name,price,shop,link,image_url,sheet_name,category_level_1,category_level_2,category_level_3,colors,sizes
```

必需列是 `row`、`product_name`、`price`、`shop`、`link`、`sheet_name`，另需至少有 `image_url` 或 `image_token` 一列。`commission` 可省略；未提供佣金时，页面不会显示佣金筛选或徽标。两种图片列可以共存：优先使用 `image_url`（HTTPS 图片地址），加载失败再读取 `assets/images/<image_token>.jpg`；两者都不可用则显示占位图。原有带 `image_token` 的 CSV 仍可使用。每行代表一款商品，`row` 应唯一，`sheet_name` 用于商家分组。价格保留真实币种，例如 `ر.س51.43`；不要把旧法国数据或欧元价格仅修改标签后当成沙特数据。商品链接应是完整的 HTTPS 地址。CSV 中含逗号、双引号或换行的字段应使用标准 CSV 引号转义；Excel 导出请选择 CSV UTF-8 格式。

`category_level_1`、`category_level_2`、`category_level_3`、`colors`、`sizes` 是可选列，分别对应货盘 J、K、L、Q、R 列。卡片显示最末级类目及颜色、尺码摘要，点开商品可查看完整三级类目和选项。无需修改原 Excel 表头；更新货盘时按商品 `row` 对应导出这些列即可。

`.xlsx` 不能直接作为这个静态页面的数据接口；这里选择浏览器可以直接读取的 CSV。以后只需更新 CSV 和图片，再提交到仓库。

## 创建 GitHub Pages 用户站点

1. 登录 GitHub，创建名为 `<你的用户名>.github.io` 的仓库（用户名替换成实际 GitHub 账号名）。这是用户站点的固定仓库名；普通仓库对应的是项目站点，网址会多一段仓库路径。
2. 将本目录的 `index.html`、`app.jsx`、`csv.js`、`.nojekyll`、`assets/` 和 `README.md` 放在该仓库根目录，并添加你自己的 `assets/products.csv`。提交并推送到 `main` 分支。仓库内已有旧 JSON 可保留，但页面不会请求它；若不希望旧数据公开，上传前不要把它放进公开仓库。
3. 打开仓库的 **Settings → Pages**，在 **Build and deployment** 下选择 **Deploy from a branch**，分支选 `main`，文件夹选 `/ (root)`，然后保存。
4. 发布后访问 `https://<你的用户名>.github.io/`。首次发布和更新需要等待 GitHub 完成部署；在 **Actions** 或 **Settings → Pages** 查看状态。无需购买域名，也无需运行构建命令。

GitHub Pages 是公开的静态托管服务：CSV、图片和页面源文件均可被访问者下载，不能放访问令牌、私人商家资料或其他敏感信息。页面直接读取同站点的 CSV，更新数据需要提交文件，不能在网页里直接修改服务器数据。

本地预览需通过 HTTP 服务访问，例如在项目根目录运行 `python -m http.server 8000` 并打开 `http://localhost:8000/`；直接双击 HTML 文件时浏览器可能阻止读取 CSV。

官方文档：[创建 GitHub Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
