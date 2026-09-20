# sea-ideal-sa

GitHub Pages 页面从仓库根目录的 `assets/products.csv` 读取商品数据。

CSV 必需列：`row,product_name,price,shop,link,sheet_name`，并至少包含 `image_url` 或 `image_token` 之一。`commission` 可省略；没有佣金数据时，页面隐藏佣金筛选和徽标。`image_url` 填写 HTTPS 图片地址（沙特货盘 Excel 的“首图”列可用于此列）；`image_token` 对应 `assets/images/<image_token>.jpg`。两列同时存在时，页面先尝试远程 URL，失败后回退到本地 JPG；均不可用则显示占位图。

原始货盘没有佣金率，不应将空值当作真实佣金数据。CSV 应保存为 UTF-8 编码并正确转义字段中的双引号；错误编码会不可逆地将阿拉伯语替换为问号。商品链接和图片链接会作为公开站点数据暴露。
