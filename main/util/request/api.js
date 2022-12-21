import {
	fetch
} from '@/util/request/request.js'

// 提交
export let submitFn = async (data) => await fetch("/demo/UserInfo", data, 'post');
