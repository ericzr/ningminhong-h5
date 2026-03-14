module.exports = {
  plugins: [
    // 将现代 CSS 特性降级为旧浏览器兼容的写法
    // oklch/oklab → rgb, inset → top/right/bottom/left, etc.
    require('postcss-preset-env')({
      stage: 2,
      features: {
        'oklab-function': true,
        'color-function': true,
        'color-mix': true,
        'custom-properties': false, // 不转换 CSS 变量，Tailwind 需要它们
      },
      browsers: ['Chrome >= 60', 'Safari >= 11', 'Firefox >= 60', 'iOS >= 11', 'Android >= 5'],
    }),
  ],
};
