import { createApp} from 'vue'
import {createVfm} from 'vue-final-modal'
import { OhVueIcon,addIcons } from 'oh-vue-icons';
import { MdVolumemuteOutlined,MdVolumeupOutlined,MdPausecircleOutlined,MdPlaycircleOutlined,MdFilteraltOutlined,MdMenuOutlined,MdCloseOutlined } from 'oh-vue-icons/icons';

addIcons(MdVolumemuteOutlined,MdVolumeupOutlined,MdPausecircleOutlined,MdPlaycircleOutlined,MdFilteraltOutlined,MdMenuOutlined,MdCloseOutlined);

import App from './App.vue'
const app = createApp(App);
const vfm = createVfm();
app.use(vfm);
app.component("v-icon", OhVueIcon);
app.mount('#app');