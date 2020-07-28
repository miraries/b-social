module.exports = {
    devServer: {
        proxy: 'http://localhost:8000',
        disableHostCheck: true
    },
    transpileDependencies: [
        "vuetify"
    ]
}
