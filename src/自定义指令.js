import Vue from 'vue'
//自动聚焦 v-focus
Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})
//节流时间----表单防止重复提交 v-throttle
Vue.directive('throttle', {
    bind: (el, binding) => {
        let throttleTime = binding.value; //节流时间
        if (!throttleTime) {
            throttleTime = 2000
        }
        let cbFun;
        el.addEventListener('click', event => {
            if (!cbFun) {
                cbFun = setTimeout(() => {
                    cbFun = null
                }, throttleTime)
            } else {
                event && event.stopImmediatePropagation()
            }
        }, true)
    }
})
//图片懒加载 v-lazy
const LazyLoad = {
    // install方法
    install (Vue, options) {
        // 代替图片的loading图
        let defaultSrc = options.default;
        Vue.directive('lazy', {
            bind (el, binding) {
                LazyLoad.init(el, binding.value, defaultSrc);
            },
            inserted (el) {
                // 兼容处理
                if ('IntersectionObserver' in window) {
                    LazyLoad.observe(el);
                } else {
                    LazyLoad.listenerScroll(el);
                }
            },
        })
    },
    // 初始化
    init (el, val, def) {
        // data-src 储存真实src
        el.setAttribute('data-src', val);
        // 设置src为loading图
        el.setAttribute('src', def);
    },
    // 利用IntersectionObserver监听el
    observe (el) {
        let io = new IntersectionObserver(entries => {
            let realSrc = el.dataset.src;
            if (entries[0].isIntersecting) {
                if (realSrc) {
                    el.src = realSrc;
                    el.removeAttribute('data-src');
                }
            }
        });
        io.observe(el);
    },
    // 监听scroll事件
    listenerScroll (el) {
        let handler = LazyLoad.throttle(LazyLoad.load, 300);
        LazyLoad.load(el);
        window.addEventListener('scroll', () => {
            handler(el);
        });
    },
    // 加载真实图片
    load (el) {
        let windowHeight = document.documentElement.clientHeight
        let elTop = el.getBoundingClientRect().top;
        let elBtm = el.getBoundingClientRect().bottom;
        let realSrc = el.dataset.src;
        if (elTop - windowHeight < 0 && elBtm > 0) {
            if (realSrc) {
                el.src = realSrc;
                el.removeAttribute('data-src');
            }
        }
    },
    // 节流
    throttle (fn, delay) {
        let timer;
        let prevTime;
        return function (...args) {
            let currTime = Date.now();
            let context = this;
            if (!prevTime) prevTime = currTime;
            clearTimeout(timer);

            if (currTime - prevTime > delay) {
                prevTime = currTime;
                fn.apply(context, args);
                clearTimeout(timer);
                return;
            }

            timer = setTimeout(function () {
                prevTime = Date.now();
                timer = null;
                fn.apply(context, args);
            }, delay);
        }
    }

}
//一键copy功能
import { Message } from 'ant-design-vue';
const vCopy = { //
    /*
      bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
      el: 作用的 dom 对象
      value: 传给指令的值，也就是我们要 copy 的值
    */
    bind (el, { value }) {
        el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
        el.handler = () => {
            if (!el.$value) {
                // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
                Message.warning('无复制内容');
                return;
            }
            // 动态创建 textarea 标签
            const textarea = document.createElement('textarea');
            // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
            textarea.readOnly = 'readonly';
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            // 将要 copy 的值赋给 textarea 标签的 value 属性
            textarea.value = el.$value;
            // 将 textarea 插入到 body 中
            document.body.appendChild(textarea);
            // 选中值并复制
            textarea.select();
            // textarea.setSelectionRange(0, textarea.value.length);
            const result = document.execCommand('Copy');
            if (result) {
                Message.success('复制成功');
            }
            document.body.removeChild(textarea);
        };
        // 绑定点击事件，就是所谓的一键 copy 啦
        el.addEventListener('click', el.handler);
    },
    // 当传进来的值更新的时候触发
    componentUpdated (el, { value }) {
        el.$value = value;
    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind (el) {
        el.removeEventListener('click', el.handler);
    },
};
export default { LazyLoad, vCopy };