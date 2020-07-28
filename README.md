<h1 align="center">Welcome to b-social 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <img src="https://api.travis-ci.com/miraries/b-social.svg?branch=master&status=passed" alt="travis build status">
  <img src="https://github.styleci.io/repos/283263826/shield?branch=master" alt="styleci status">
  <img src="https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot" alt="dependabot status">
</p>

> Your favorite socal network based on express, socket-io, kafka and Vue

### 🏠 [Homepage](https://github.com/miraries/b-social)

## Install

1. Update `KAFKA_ADVERTISED_HOST_NAME` in `docker-compose.yml` to match your hostname, or just change it to `kafka`
2. Run

```sh
docker-compose up
```

3. Import `.kibana/export.ndjson` to Kibana at `localhost:5601`

##### Note

If any of the necessary ports are unavailable locally (used for development) edit `docker-compose.yml` so they are not exposed, eg. change `9200:9200` to `9200`

### Testing

Tests can be run for the backend and frontend services:

```sh
cd back
npm i
npm run test
```

```sh
cd front
npm i
npm run test:unit
```

## Author

👤 **Ivan Kotlaja**

* Website: ivnk.dev
* Github: [@miraries](https://github.com/miraries)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/miraries/b-social/issues). 

## Show your support

Give a ⭐️

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_