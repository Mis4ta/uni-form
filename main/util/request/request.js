const BASEURL_ = 'http://localhost:8080'


export function fetch(uri, data, method = 'POST', header) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASEURL_ + uri,
			method: method,
			data: {
				...data,
				...{}
			},
			success(res) {
				if (res.data.errno === 0) {
					// 业务代码的处理
					// res.data整个请求的数据
					resolve(res.data);
				} else {
					resolve(res.data);
				}
			},
			fail(err) {
				reject(err);
			}
		})
	})


}
