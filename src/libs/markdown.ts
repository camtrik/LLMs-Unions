import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// 引入 highlight.js 的样式
import 'highlight.js/styles/github.css'

const mdOptions: MarkdownIt.Options = {
  html: true,        // 允许 HTML 标签
  linkify: true,     // 自动将类似 URL 的文本转换为链接
  typographer: true, // 启用排版增强功能
  breaks: true,      // 将换行符转换为 <br>
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">` + 
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + 
               '</code></pre>';
      } catch (error) {
        console.error('Highlight error:', error);
        return `<pre class="hljs"><code class="language-${lang}">` + 
               hljs.escapeHTML(str) + 
               '</code></pre>';
      }
    }
    return `<pre class="hljs"><code>` + hljs.escapeHTML(str) + '</code></pre>';
  }
}

export const md = new MarkdownIt(mdOptions)

// 添加列表渲染规则
md.renderer.rules.list_item_open = (tokens, idx, options) => {
  return '<li>';
};

md.renderer.rules.list_item_close = () => {
  return '</li>\n';
};

md.renderer.rules.ordered_list_open = (tokens, idx, options) => {
  return '<ol>\n';
};

md.renderer.rules.ordered_list_close = () => {
  return '</ol>\n';
};