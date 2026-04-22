import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import DmnPlayground from '../components/DmnPlayground.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DmnPlayground', DmnPlayground);
  },
} satisfies Theme;
