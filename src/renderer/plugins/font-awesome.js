import Vue from 'vue'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faDownload,
  faEye,
  faClosedCaptioning,
  faFileArchive,
  faSearch,
  faArrowLeft,
  faPlus,
  faMinus,
  faHdd,
  faLongArrowAltDown,
  faTimes,
  faPlay,
  faMagnet,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

library.add(faDownload, faEye, faClosedCaptioning, faFileArchive, faSearch, faArrowLeft, faPlus, faMinus, faHdd, faLongArrowAltDown, faTimes, faPlay, faMagnet, faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
