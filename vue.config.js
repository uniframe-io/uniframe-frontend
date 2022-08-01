//added dev server regarding
//https://stackoverflow.com/questions/55754906/errors-in-browser-console-requests-to-sockjs-node-infot-1555629946494
module.exports = {
	devServer: {
		disableHostCheck: true,
		port: 80,
	},
	publicPath: '/',
};
