import { createApp} from 'vue'
import { OhVueIcon,addIcons } from 'oh-vue-icons';
import { MdVolumemuteOutlined,MdVolumeupOutlined,MdPausecircleOutlined,MdPlaycircleOutlined,MdFilteraltOutlined,MdMenuOutlined,MdCloseOutlined } from 'oh-vue-icons/icons';

addIcons(MdVolumemuteOutlined,MdVolumeupOutlined,MdPausecircleOutlined,MdPlaycircleOutlined,MdFilteraltOutlined,MdMenuOutlined,MdCloseOutlined);

import App from './App.vue'
const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount('#app');